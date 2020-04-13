package ch.helpfuleth.instanthelpfinder.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import ch.helpfuleth.instanthelpfinder.web.rest.TestUtil;

public class TurningEventTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TurningEvent.class);
        TurningEvent turningEvent1 = new TurningEvent();
        turningEvent1.setId(1L);
        TurningEvent turningEvent2 = new TurningEvent();
        turningEvent2.setId(turningEvent1.getId());
        assertThat(turningEvent1).isEqualTo(turningEvent2);
        turningEvent2.setId(2L);
        assertThat(turningEvent1).isNotEqualTo(turningEvent2);
        turningEvent1.setId(null);
        assertThat(turningEvent1).isNotEqualTo(turningEvent2);
    }
}
