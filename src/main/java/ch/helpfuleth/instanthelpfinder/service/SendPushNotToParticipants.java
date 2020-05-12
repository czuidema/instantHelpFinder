package ch.helpfuleth.instanthelpfinder.service;

import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;

public class SendPushNotToParticipants implements JavaDelegate  {

    public void execute(DelegateExecution execution) {
        System.out.println("Sending push notification to all participants of the turing event...");
    }

}
