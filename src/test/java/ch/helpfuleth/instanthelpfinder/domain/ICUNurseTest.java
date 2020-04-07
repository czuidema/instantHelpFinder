package ch.helpfuleth.instanthelpfinder.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import ch.helpfuleth.instanthelpfinder.web.rest.TestUtil;

public class ICUNurseTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ICUNurse.class);
        ICUNurse iCUNurse1 = new ICUNurse();
        iCUNurse1.setId(1L);
        ICUNurse iCUNurse2 = new ICUNurse();
        iCUNurse2.setId(iCUNurse1.getId());
        assertThat(iCUNurse1).isEqualTo(iCUNurse2);
        iCUNurse2.setId(2L);
        assertThat(iCUNurse1).isNotEqualTo(iCUNurse2);
        iCUNurse1.setId(null);
        assertThat(iCUNurse1).isNotEqualTo(iCUNurse2);
    }
}
