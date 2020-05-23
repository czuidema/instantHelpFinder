package ch.helpfuleth.instanthelpfinder.service;

import ch.helpfuleth.instanthelpfinder.repository.DoctorRepository;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.flowable.engine.runtime.ProcessInstance;
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

    @Autowired
    public FlowableService(
        RuntimeService runtimeService,
        TaskService taskService,
        DoctorRepository doctorRepository
    ) {
        this.runtimeService = runtimeService;
        this.taskService = taskService;
        this.doctorRepository = doctorRepository;
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

    public List<String> setCandidateUsers(Long turnEventId) {
        // use TurnEventId to get NurseId, DoctorId, AssistantsId
        return Arrays.asList("NurseId", "DoctorId", "AssistantId");
    }

    public void deleteProcessInstance(String processInstanceId) {
        runtimeService.deleteProcessInstance(processInstanceId, "None" );
    }

    public void completeTask(String taskId) {
        taskService.complete(taskId);
    }

    public void setVariable(String executionId, String variableName, Long value) {
        runtimeService.setVariable(executionId,variableName,value);
    }

    // TODO: carefully check this query!
    public ProcessInstance getProcessInstanceByTurningEventId(Long turningEventId) {
        return runtimeService.createProcessInstanceQuery().variableValueEquals("turningEventId",turningEventId).singleResult();
    }

    public Task getTaskByProcessInstanceId(String processInstanceId) {
        return taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult();
    }

    public Map<String, Object> getProcessInstanceVariables(String processInstanceId) {
        return runtimeService.getVariables(processInstanceId);
    }

}
