package ch.helpfuleth.instanthelpfinder.service;

import ch.helpfuleth.instanthelpfinder.domain.PushSubscription;
import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Security;
import java.util.Collection;

@Service
public class PushNotificationService {

    private final String privateKey = "moWE5OoxEZGWiQET0lpnBAXEQF13dC3yDi9T8ZzBUGI";

    private final String publicKey = "BKfZe7R6OIe5qTogynU5WCkzqZyaIppcYNh_qvWlvM0x235FJEz1KhH2rHXsK0l_QA-TX6H3eLQRjY9jv-EdgjU";

    private final PushSubscriptionRepository pushSubscriptionRepository;

    @Autowired
    public PushNotificationService (
        PushSubscriptionRepository pushSubscriptionRepository
    ) {
        this.pushSubscriptionRepository = pushSubscriptionRepository;
        Security.addProvider(new BouncyCastleProvider());
    }

    /**
     * Sends a push message to a Subscription
     * @param sub
     * @param message
     */
    public void sendPushMessage(PushSubscription sub, String message) {

        // Figure out if we should use GCM for this notification somehow
        Notification notification;
        PushService pushService;

        try {

            notification = new Notification(
                sub.getEndpoint(),
                sub.getp256dh(),
                sub.getAuth(),
                message
            );

            // Instantiate the push service, no need to use an API key for Push API
            pushService = new PushService(publicKey, privateKey, "New Ad published.");

            HttpResponse httpResponse = pushService.send(notification);
            int statusCode = httpResponse.getStatusLine().getStatusCode();

            System.out.println(statusCode);
            System.out.println(httpResponse);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void notifyAllDoctors(TurningEvent turningEvent) {

//      TODO: add method to PushSubscriptionRepository for selecting Doctor subscriptions
        Collection<PushSubscription> allSubscriptions = pushSubscriptionRepository.findAll();

        String message = "{\"title\": \"Patient drehen\", \"body\": \"Zeitfenster: " +
            (
                (turningEvent.getDefiniteTimeSlot() != null) ?
                turningEvent.getDefiniteTimeSlot().toString() :
                "unbekannt"
            ) + "\"," +
                "\"data\": {\"url\": \"localhost:8080/turningEvents/" + turningEvent.getId() + "\"}}" ;

        for (PushSubscription subscription: allSubscriptions) {

            sendPushMessage(subscription, message);
        }
    }
}
