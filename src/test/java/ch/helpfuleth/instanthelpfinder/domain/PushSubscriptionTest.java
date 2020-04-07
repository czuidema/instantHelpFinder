package ch.helpfuleth.instanthelpfinder.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import ch.helpfuleth.instanthelpfinder.web.rest.TestUtil;

public class PushSubscriptionTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PushSubscription.class);
        PushSubscription pushSubscription1 = new PushSubscription();
        pushSubscription1.setId(1L);
        PushSubscription pushSubscription2 = new PushSubscription();
        pushSubscription2.setId(pushSubscription1.getId());
        assertThat(pushSubscription1).isEqualTo(pushSubscription2);
        pushSubscription2.setId(2L);
        assertThat(pushSubscription1).isNotEqualTo(pushSubscription2);
        pushSubscription1.setId(null);
        assertThat(pushSubscription1).isNotEqualTo(pushSubscription2);
    }
}
