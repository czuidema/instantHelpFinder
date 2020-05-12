package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import ch.helpfuleth.instanthelpfinder.service.FlowableService;
import ch.helpfuleth.instanthelpfinder.service.TurningEventService;
import ch.helpfuleth.instanthelpfinder.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.task.api.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@RestController
@Transactional
public class FlowableResource {

    private final Logger log = LoggerFactory.getLogger(TurningEventResource.class);

    private static final String ENTITY_NAME = "task";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FlowableService flowableService;
    private final TurningEventRepository turningEventRepository;
    private final TaskService taskService;
    private final TurningEventService turningEventService;
    private final RuntimeService runtimeService;

    public FlowableResource(
        FlowableService flowableService,
        TurningEventRepository turningEventRepository,
        TaskService taskService,
        TurningEventService turningEventService,
        RuntimeService runtimeService
    ) {
        this.flowableService = flowableService;
        this.turningEventRepository = turningEventRepository;
        this.taskService = taskService;
        this.turningEventService = turningEventService;
        this.runtimeService = runtimeService;
    }

    @PostMapping("/turning-events")
    public ResponseEntity<TurningEvent> createTurningEvent(@RequestBody TurningEvent turningEvent, @RequestBody String processKey) throws URISyntaxException {
        log.debug("REST request to save TurningEvent : {}", turningEvent);
        if (turningEvent.getId() != null) {
            throw new BadRequestAlertException("A new turningEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Map<String, Object> variables = new HashMap<String, Object>();
        variables.put("turningEventId",turningEvent.getId());
        // The processKey could be ICUNurseProcess or DoctorProcess depending on who triggers the process
        runtimeService.startProcessInstanceByKey(processKey, variables);
        TurningEvent result = this.turningEventService.createNew(turningEvent);
        return ResponseEntity.created(new URI("/api/turning-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    // start a ICUNurseProcess on the command line
    @PostMapping(value="/process")
    public void createTurningEventSimple() {
        Map<String, Object> variables = new HashMap<String, Object>();
        variables.put("turningEventId","turningEvent.getId()");
        // The processKey could be ICUNurseProcess or DoctorProcess depending on who triggers the process
        runtimeService.startProcessInstanceByKey("Process_8d5a44bd-f0e4-46a9-a3fd-d152466922a6", variables);
    }

    /*@PostMapping(value="/process")
    public void startProcessInstance(@RequestBody StartProcessRepresentation startProcessRepresentation) {
        flowableService.startProcess(startProcessRepresentation.getAssignee());
    }*/

    // get tasks for a candidate group, candidateGroupName can be Doctors or Assistants
    @RequestMapping(value="/tasks/candidateGroup/{candidateGroupName}", method= RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Optional<TurningEvent>> getCandidateGroupTasks(@PathVariable String candidateGroupName) {
        log.debug("REST request to get TurningEvents for a specific user : {}", candidateGroupName);

        List<Task> tasks = flowableService.getCandidateGroupTasks(candidateGroupName);
        Map<String, Optional<TurningEvent>> taskMap = new HashMap<String, Optional<TurningEvent>>();
        for (Task task : tasks) {
            Map<String,Object> processVariables = task.getProcessVariables();
            // get turningEventId from task
            Long turningEventId = Long.valueOf(processVariables.get("turningEventId").toString());
            Optional<TurningEvent> turningEvent = turningEventRepository.findOneWithEagerRelationships(turningEventId);
            taskMap.put(task.getId(), turningEvent);
        }
        return taskMap;
    }

    // get tasks for candidate group on the command line
    @RequestMapping(value="/tasks/candidateGroup", method= RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
    public List<TaskRepresentation> getCandidateGroupTasksSimple(@RequestParam String candidateGroupName) {
        List<Task> tasks = flowableService.getCandidateGroupTasks(candidateGroupName);
        List<TaskRepresentation> dtos = new ArrayList<TaskRepresentation>();
        for (Task task : tasks) {
            dtos.add(new TaskRepresentation(task.getId(), task.getName()));
        }
        return dtos;
    }

    // complete task on the command line
    @PutMapping("/tasks/candidateGroup")
    public void completeCandidateGroupTasksSimple(@RequestParam String taskId) throws URISyntaxException {
        log.debug("REST request to complete task : {}", taskId);
        if (taskId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        taskService.complete(taskId);
    }


    @RequestMapping(value="/tasks/assignee", method= RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
    public List<TaskRepresentation> getAssigneeTasks(@RequestParam String assignee) {
        List<Task> tasks = flowableService.getAssigneeTasks(assignee);
        List<TaskRepresentation> dtos = new ArrayList<TaskRepresentation>();
        for (Task task : tasks) {
            dtos.add(new TaskRepresentation(task.getId(), task.getName()));
        }
        return dtos;
    }

    @RequestMapping(value="/tasks/user/{userId}", method= RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Optional<TurningEvent>> getUserTasks(@PathVariable String userId) {
            log.debug("REST request to get TurningEvents for a specific user : {}", userId);

            List<Task> tasks = flowableService.getUserTasks(userId);
            Map<String, Optional<TurningEvent>> variables = new HashMap<String, Optional<TurningEvent>>();
            for (Task task : tasks) {
                Map<String,Object> processVariables = task.getProcessVariables();
                // get turningEventId from task
                Long turningEventId = Long.valueOf(processVariables.get("turningEventId").toString());
                Optional<TurningEvent> turningEvent = turningEventRepository.findOneWithEagerRelationships(turningEventId);
                variables.put(task.getId(), turningEvent);
            }
        return variables;
    }

    @PutMapping("/tasks/user/{taskId}")
    public void completeTask(@PathVariable String taskId) throws URISyntaxException {
        log.debug("REST request to complete task : {}", taskId);
        if (taskId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        taskService.complete(taskId);
    }

    static class TaskRepresentation {

        private String id;
        private String name;

        public TaskRepresentation(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getId() {
            return id;
        }
        public void setId(String id) {
            this.id = id;
        }
        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }

    }

    static class StartProcessRepresentation {

        private String assignee;

        public String getAssignee() {
            return assignee;
        }

        public void setAssignee(String assignee) {
            this.assignee = assignee;
        }
    }

}
