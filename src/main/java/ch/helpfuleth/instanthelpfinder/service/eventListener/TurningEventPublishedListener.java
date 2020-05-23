package ch.helpfuleth.instanthelpfinder.service.eventListener;

import ch.helpfuleth.instanthelpfinder.service.PushNotificationService;
import ch.helpfuleth.instanthelpfinder.service.event.OnTurningEventPublishedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class TurningEventPublishedListener {

    private final PushNotificationService pushNotificationService;

    @Autowired
    public TurningEventPublishedListener(PushNotificationService pushNotificationService) {
        this.pushNotificationService = pushNotificationService;
    }

    @TransactionalEventListener
    public void onApplicationEvent(OnTurningEventPublishedEvent event) {
        pushNotificationService.notifyAllDoctors(event.getTurningEvent());
    }
}
