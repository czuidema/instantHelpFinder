package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import ch.helpfuleth.instanthelpfinder.service.FlowableService;
import ch.helpfuleth.instanthelpfinder.web.rest.errors.BadRequestAlertException;
import com.netflix.discovery.converters.Auto;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.task.api.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.*;

@RestController
@Transactional
public class TurningEventTestResource {

    private final Logger log = LoggerFactory.getLogger(TurningEventResource.class);

    private static final String ENTITY_NAME = "turningEvent";

    RuntimeService runtimeService;
    FlowableService flowableService;
    TurningEventRepository turningEventRepository;
    TaskService taskService;

    public TurningEventTestResource(
        RuntimeService runtimeService,
        FlowableService flowableService,
        TurningEventRepository turningEventRepository,
        TaskService taskService
    ) {
        this.runtimeService = runtimeService;
        this.flowableService = flowableService;
        this.turningEventRepository = turningEventRepository;
        this.taskService = taskService;
    }

    // get tasks for candidate group on the command line
    @RequestMapping(value="/tasks/candidateGroup", method= RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
    public List<TaskRepresentation> getCandidateGroupTasksSimple(@RequestParam String candidateGroupName) {
        List<Task> tasks = flowableService.getCandidateGroupTasks(candidateGroupName);
        List<TaskRepresentation> dtos = new ArrayList<TaskRepresentation>();
        for (Task task : tasks) {
            String processInstanceId = task.getProcessInstanceId();
            Map<String,Object> processVariables = runtimeService.getVariables(processInstanceId);
            Long turningEventId = Long.valueOf(processVariables.get("turningEventId").toString()).longValue();
            dtos.add(new TaskRepresentation(task.getId(), task.getName(), processInstanceId, turningEventId));
        }
        return dtos;
    }

    // complete task on the command line
    @RequestMapping(value="/tasks/toComplete", method= RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
    public TaskRepresentation completeCandidateGroupTasksSimple(@RequestParam Long turningEventId) throws URISyntaxException {
        log.debug("REST request to complete task : {}", turningEventId);
        if (turningEventId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TurningEvent turningEvent = turningEventRepository.getOne(turningEventId);
        ProcessInstance processInstance = flowableService.getProcessInstanceByTurningEventId(turningEventId);

        Task task = taskService.createTaskQuery().processInstanceId(processInstance.getId()).singleResult();
        return new TaskRepresentation(task.getId(), "we do not know", processInstance.getId(), turningEventId);
    }

    static class TaskRepresentation {

        private String id;
        private String name;
        private String processInstanceId;
        private Long turningEventId;

        public TaskRepresentation(String id, String name, String processInstanceId, Long turningEventId) {
            this.id = id;
            this.name = name;
            this.processInstanceId = processInstanceId;
            this.turningEventId = turningEventId;
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
        public String getProcessInstanceId() {
            return processInstanceId;
        }
        public void setProcessInstanceId(String processInstanceId) {
            this.processInstanceId = processInstanceId;
        }
        public Long getTurningEventId() { return turningEventId; }
        public void setTurningEventId(Long turningEventId) { this.turningEventId = turningEventId; }

    }


}
