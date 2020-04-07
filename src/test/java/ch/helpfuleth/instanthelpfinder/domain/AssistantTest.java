package ch.helpfuleth.instanthelpfinder.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import ch.helpfuleth.instanthelpfinder.web.rest.TestUtil;

public class AssistantTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Assistant.class);
        Assistant assistant1 = new Assistant();
        assistant1.setId(1L);
        Assistant assistant2 = new Assistant();
        assistant2.setId(assistant1.getId());
        assertThat(assistant1).isEqualTo(assistant2);
        assistant2.setId(2L);
        assertThat(assistant1).isNotEqualTo(assistant2);
        assistant1.setId(null);
        assertThat(assistant1).isNotEqualTo(assistant2);
    }
}
