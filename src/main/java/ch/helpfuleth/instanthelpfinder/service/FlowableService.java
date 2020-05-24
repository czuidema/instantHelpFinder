package ch.helpfuleth.instanthelpfinder.service;

import ch.helpfuleth.instanthelpfinder.domain.TimeSlot;
import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.repository.DoctorRepository;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import com.sun.imageio.plugins.common.SingleTileRenderedImage;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.identitylink.api.IdentityLink;
import org.flowable.task.api.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class FlowableService {

    private final RuntimeService runtimeService;
    private final TaskService taskService;
    private final DoctorRepository doctorRepository;
    private final TurningEventRepository turningEventRepository;

    @Autowired
    public FlowableService(
        RuntimeService runtimeService,
        TaskService taskService,
        DoctorRepository doctorRepository,
        TurningEventRepository turningEventRepository
    ) {
        this.runtimeService = runtimeService;
        this.taskService = taskService;
        this.doctorRepository = doctorRepository;
        this.turningEventRepository = turningEventRepository;
    }

    public ProcessInstance startProcess(Map<String, Object> variables) {
        return runtimeService.startProcessInstanceByKey("Process_8d5a44bd-f0e4-46a9-a3fd-d152466922a6", variables);
    }

    // Get tasks by userId
    public List<Task> getAssigneeTasks(String assignee) {
        return taskService.createTaskQuery().taskAssignee(assignee).list();
    }

    // Get tasks by userId
    public List<Task> getUserTasks(String userId) {
        return taskService.createTaskQuery().taskCandidateUser(userId).list();
    }

    // Get tasks for a user group (Doctors, Assistants)
    public List<Task> getCandidateGroupTasks(String groupName) {
        return taskService.createTaskQuery().taskCandidateGroup(groupName).list();
    }

    public void deleteProcessInstance(String processInstanceId) {
        runtimeService.deleteProcessInstance(processInstanceId, "None" );
    }

    public void completeTask(String taskId) {
        taskService.complete(taskId);
    }

    public void setVariable(String executionId, String variableName, Object value) {
        runtimeService.setVariable(executionId,variableName,value);
    }

    public void addAssistantToTaskById(Long userId, String taskId) {
        taskService.addCandidateUser(taskId, userId.toString());
    }

    public boolean isAssistantParticipatingInTurningEvent(Long userId, Long turningEventId) {
        TurningEvent turningEvent = turningEventRepository.getOne(turningEventId);
        for (TimeSlot timeSlot: turningEvent.getPotentialTimeSlots()) {
            Task task = getTaskByTimeSlotId(timeSlot.getId());
            List<org.flowable.identitylink.api.IdentityLink> assistantsVoted = taskService.getIdentityLinksForTask(task.getId());
            for (IdentityLink assistantVoted : assistantsVoted) {
                Long assistantUserId = Long.valueOf(assistantVoted.getUserId());
                if (assistantUserId.equals(userId)) {
                    return true;
                }
            }
        }
        return false;
    }

    // TODO: carefully check this query!
    public ProcessInstance getProcessInstanceByTurningEventId(Long turningEventId) {
        return runtimeService.createProcessInstanceQuery().variableValueEquals("turningEventId",turningEventId).singleResult();
    }

    public Task getTaskByTimeSlotId(Long timeSlotId) {
        return taskService.createTaskQuery().taskVariableValueEquals("timeSlotId", timeSlotId).singleResult();
    }

    public Task getTaskByProcessInstanceId(String processInstanceId) {
        return taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult();
    }

    public List<IdentityLink> getIdentityLinksForTaskById(String taskId) {
        return taskService.getIdentityLinksForTask(taskId);
    }

    public Map<String, Object> getProcessInstanceVariables(String processInstanceId) {
        return runtimeService.getVariables(processInstanceId);
    }

}
