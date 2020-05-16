package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import ch.helpfuleth.instanthelpfinder.service.FlowableService;
import ch.helpfuleth.instanthelpfinder.web.rest.errors.BadRequestAlertException;
import com.netflix.discovery.converters.Auto;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
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
            Object processVariables = task.getProcessVariables().get("turningEventId");
            //Long turningEventId = Long.valueOf((String) processVariables.get("turningEventId"));
            Long mockNumber = 1L;
            dtos.add(new TaskRepresentation(task.getId(), task.getName(), processVariables));
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

    static class TaskRepresentation {

        private String id;
        private String name;
        private Object turningEventId;

        public TaskRepresentation(String id, String name, Object turningEventId) {
            this.id = id;
            this.name = name;
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
        public Object getTurningEventId() {
            return turningEventId;
        }
        public void setTurningEventId(Object turningEventId) {
            this.turningEventId = turningEventId;
        }

    }


}
