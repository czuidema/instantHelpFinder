package ch.helpfuleth.instanthelpfinder.service;

import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;

public class SendPushNotToAllAss implements JavaDelegate  {

    public void execute(DelegateExecution execution) {
        System.out.println("Sending push notification to all assistants...");
    }

}
