package ch.helpfuleth.instanthelpfinder.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A ICUNurse.
 */
@Entity
@Table(name = "icu_nurse")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ICUNurse extends UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove


    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ICUNurse{" +
            "}";
    }
}
