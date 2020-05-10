package ch.helpfuleth.instanthelpfinder.service;

import ch.helpfuleth.instanthelpfinder.repository.DoctorRepository;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.task.api.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class FlowableService {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private TaskService taskService;

    public void startProcess(String assignee) {
        runtimeService.startProcessInstanceByKey("oneTaskProcess");
    }

    // Get tasks by userId
    public List<Task> getUserTasks(String userId) {
        return taskService.createTaskQuery().taskCandidateUser(userId).list();
    }

    // Get tasks for a user group (Doctors, Assistants)
    public List<Task> getGroupTasks(String groupName) {
        return taskService.createTaskQuery().taskCandidateGroup(groupName).list();
    }

    public List<String> setCandidateUsers(Long turnEventId) {
        // use TurnEventId to get NurseId, DoctorId, AssistantsId
        return Arrays.asList("NurseId", "DoctorId", "AssistantId");
    }

}
