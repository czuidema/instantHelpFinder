package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.domain.Assistant;
import ch.helpfuleth.instanthelpfinder.domain.Doctor;
import ch.helpfuleth.instanthelpfinder.domain.TimeSlot;
import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.repository.AssistantRepository;
import ch.helpfuleth.instanthelpfinder.repository.DoctorRepository;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import ch.helpfuleth.instanthelpfinder.service.FlowableService;
import ch.helpfuleth.instanthelpfinder.service.TurningEventService;
import ch.helpfuleth.instanthelpfinder.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.identitylink.api.IdentityLink;
import org.flowable.task.api.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * REST controller for managing {@link ch.helpfuleth.instanthelpfinder.domain.TurningEvent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TurningEventResource {

    private final Logger log = LoggerFactory.getLogger(TurningEventResource.class);

    private static final String ENTITY_NAME = "turningEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TurningEventRepository turningEventRepository;

    private final TurningEventService turningEventService;
    private final FlowableService flowableService;
    private final DoctorRepository doctorRepository;
    private final AssistantRepository assistantRepository;

    public TurningEventResource(
        TurningEventRepository turningEventRepository,
        TurningEventService turningEventService,
        FlowableService flowableService,
        DoctorRepository doctorRepository,
        AssistantRepository assistantRepository
    ) {
        this.turningEventRepository = turningEventRepository;
        this.turningEventService = turningEventService;
        this.flowableService = flowableService;
        this.doctorRepository = doctorRepository;
        this.assistantRepository = assistantRepository;
    }

    /**
     * {@code POST  /turning-events} : Create a new turningEvent.
     *
     * @param turningEvent the turningEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new turningEvent, or with status {@code 400 (Bad Request)} if the turningEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/turning-events")
    public ResponseEntity<TurningEvent> createTurningEvent(@RequestBody TurningEvent turningEvent) throws URISyntaxException {
        log.debug("REST request to save TurningEvent : {}", turningEvent);
        if (turningEvent.getId() != null) {
            throw new BadRequestAlertException("A new turningEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }

        TurningEvent result = this.turningEventService.createNew(turningEvent);

        Map<String, Object> variables = new HashMap<String, Object>();
        variables.put("turningEventId", result.getId());

        // start process instance (currently ICUNurse)
        ProcessInstance processInstance = flowableService.startProcess(variables);

        return ResponseEntity.created(new URI("/api/turning-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /turning-events} : Updates an existing turningEvent.
     *
     * @param turningEvent the turningEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated turningEvent,
     * or with status {@code 400 (Bad Request)} if the turningEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the turningEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/turning-events")
    public ResponseEntity<TurningEvent> updateTurningEvent(@RequestBody TurningEvent turningEvent) throws URISyntaxException {
        log.debug("REST request to update TurningEvent : {}", turningEvent);
        if (turningEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TurningEvent result = turningEventService.update(turningEvent);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, turningEvent.getId().toString()))
            .body(result);
    }

    @PutMapping("/turning-events/doctors/{userRoleId}")
    public ResponseEntity<TurningEvent> acceptTurningEventDoctor(@RequestBody TurningEvent turningEvent, @PathVariable Long userRoleId) throws URISyntaxException {
        log.debug("REST request to update TurningEvent : {}", turningEvent);
        if (turningEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        TurningEvent result = turningEventService.update(turningEvent);

        Doctor doctor = doctorRepository.getOne(userRoleId);
        result.setDoctor(doctor);

        Collection<String> timeSlotIds = new ArrayList<String>();
        for (TimeSlot timeSlot : result.getPotentialTimeSlots()) {
            timeSlotIds.add(timeSlot.getId().toString());
        }

        ProcessInstance processInstance = flowableService.getProcessInstanceByTurningEventId(turningEvent.getId());
        flowableService.setVariable(processInstance.getId(), "timeSlotIds", timeSlotIds);

        Task task = flowableService.getTaskByProcessInstanceId(processInstance.getId());
        flowableService.completeTask(task.getId());
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, turningEvent.getId().toString()))
            .body(result);
    }

    @PutMapping("/turning-events/assistants/{userRoleId}")
    public ResponseEntity<TurningEvent> acceptTurningEventAssistant(@RequestBody TurningEvent inputData, @PathVariable Long userRoleId) {
        log.debug("REST request to update TurningEvent : {}", inputData);
        if (inputData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TurningEvent turningEvent = turningEventRepository.getOne(inputData.getId());

        Predicate<TimeSlot> selectedTimeSlotsPredicate = TimeSlot::isSelected;
        Collection<TimeSlot> selectedTimeSlots = inputData.getPotentialTimeSlots().stream().filter(selectedTimeSlotsPredicate).collect(Collectors.toList());
        // TODO: sort selectedTimeSlots by time.

        for (TimeSlot timeSlot : selectedTimeSlots) {
            // TODO: This task may not exist anymore, if another assistant finishes the task just a bit before.

            Task task = flowableService.getTaskByTimeSlotId(timeSlot.getId());
            flowableService.addAssistantToTaskById(userRoleId, task.getId());

            Predicate<org.flowable.identitylink.api.IdentityLink> assistantsForThisTimeSlotPredicate = identityLink -> identityLink.getType().equals("PARTICIPANT");
            List<org.flowable.identitylink.api.IdentityLink> assistantsForThisTimeSlot = flowableService.getIdentityLinksForTaskById(task.getId()).stream().filter(assistantsForThisTimeSlotPredicate).collect(Collectors.toList());

            if (assistantsForThisTimeSlot.size() >= 3) {
                Set<Assistant> assistants = new HashSet<Assistant>();
                for (IdentityLink assistantIdentityLink : assistantsForThisTimeSlot) {
                    Long assistantUserRoleId = Long.valueOf(assistantIdentityLink.getUserId());
                    Assistant assistant = assistantRepository.getOne(assistantUserRoleId);
                    assistants.add(assistant);
                }

                turningEvent.setAssistants(assistants);
                turningEvent.setDefiniteTimeSlot(timeSlot);
                flowableService.completeTask(task.getId());

                return ResponseEntity.ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, turningEvent.getId().toString()))
                    .body(turningEvent);
            }
        }

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, turningEvent.getId().toString()))
            .body(turningEvent);
    }

    /**
     * {@code GET  /turning-events} : get all the turningEvents.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of turningEvents in body.
     */
    @GetMapping("/turning-events")
    public List<TurningEvent> getAllTurningEvents(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TurningEvents");
        return turningEventRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /turning-events/:id} : get the "id" turningEvent.
     *
     * @param id the id of the turningEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the turningEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/turning-events/{id}")
    public ResponseEntity<TurningEvent> getTurningEvent(@PathVariable Long id) {
        log.debug("REST request to get TurningEvent : {}", id);
        Optional<TurningEvent> turningEvent = turningEventRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(turningEvent);
    }

    // get tasks for a candidate group, candidateGroupName can be Doctors or Assistants

    /**
     * {@code GET  /turning-events/open/:candidateGroupName} : get all the turningEvents associated to candidateGroupName.
     *
     * @param candidateGroupName name of the candidate group.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of turningEvents in body.
     */
    @GetMapping("/turning-events/open/{candidateGroupName}")
    public List<TurningEvent> getOpenTurningEventsForCandidateGroup(@PathVariable String candidateGroupName) {
        log.debug("REST request to get TurningEvents for a specific candidate group : {}", candidateGroupName);

        List<Task> tasks = flowableService.getCandidateGroupTasks(candidateGroupName);
        Set<TurningEvent> turningEvents = new HashSet<TurningEvent>();
        for (Task task : tasks) {
            String processInstanceId = task.getProcessInstanceId();
            Map<String, Object> processVariables = flowableService.getProcessInstanceVariables(processInstanceId);
            Long turningEventId = Long.valueOf(processVariables.get("turningEventId").toString()).longValue();

            TurningEvent turningEvent = turningEventRepository.getOne(turningEventId);
            turningEvents.add(turningEvent);
        }
        return new ArrayList<TurningEvent>(turningEvents);
    }

    @GetMapping("/turning-events/{id}/timeslots")
    public List<TimeSlotRepresentation> getTimeSlotsForTurningEvent(@PathVariable Long id) {
        log.debug("REST request to get TimeSlots for TurningEvent : {}", id);
        TurningEvent turningEvent = turningEventRepository.getOne(id);

        List<TimeSlotRepresentation> listOfTimeSlots = new ArrayList<TimeSlotRepresentation>();

        for (TimeSlot timeSlot : turningEvent.getPotentialTimeSlots()) {
            Set<Assistant> assistants = new HashSet<Assistant>();


            Task task = flowableService.getTaskByTimeSlotId(timeSlot.getId());
            // if the turningEvent is not yet visible to assistants, there is no task associated to its potentialTimeSlots (i.e. task is null).
            if (task != null) {
                Predicate<org.flowable.identitylink.api.IdentityLink> assistantsForThisTimeSlotPredicate = identityLink -> identityLink.getType().equals("PARTICIPANT");
                List<org.flowable.identitylink.api.IdentityLink> assistantsForThisTimeSlot = flowableService
                    .getIdentityLinksForTaskById(task.getId())
                    .stream().filter(assistantsForThisTimeSlotPredicate)
                    .collect(Collectors.toList());

                for (IdentityLink assistantIdentityLink : assistantsForThisTimeSlot) {
                    Long assistantUserRoleId = Long.valueOf(assistantIdentityLink.getUserId());
                    Assistant assistant = assistantRepository.getOne(assistantUserRoleId);
                    assistants.add(assistant);
                }
            }
            TimeSlotRepresentation timeSlotRepresentation = new TimeSlotRepresentation(timeSlot, assistants);
            listOfTimeSlots.add(timeSlotRepresentation);
        }
        return listOfTimeSlots;
    }

    /**
     * {@code DELETE  /turning-events/:id} : delete the "id" turningEvent.
     *
     * @param id the id of the turningEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/turning-events/{id}")
    public ResponseEntity<Void> deleteTurningEvent(@PathVariable Long id) {
        log.debug("REST request to delete TurningEvent : {}", id);

        Task task = flowableService.getTaskByTurningEventId(id);
        flowableService.completeTask(task.getId());

        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }


    static class TimeSlotRepresentation {

        private TimeSlot timeSlot;
        private Set<Assistant> assistants;

        public TimeSlotRepresentation(TimeSlot timeSlot, Set<Assistant> assistants) {
            this.timeSlot = timeSlot;
            this.assistants = assistants;
        }

        public TimeSlot getTimeSlot() {
            return timeSlot;
        }
        public void setTimeSlot(TimeSlot timeSlot) {
            this.timeSlot = timeSlot;
        }

        public Set<Assistant> getAssistants() {
            return assistants;
        }
        public void setAssistants(Set<Assistant> assistants) {
            this.assistants = assistants;
        }
    }

}
