package ch.helpfuleth.instanthelpfinder.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A ICUNurse.
 */
@Entity
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ICUNurse extends UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @ManyToMany(mappedBy = "assistants")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<TurningEvent> turningEvents = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    public Set<TurningEvent> getTurningEvents() {
        return turningEvents;
    }

    public void setTurningEvents(Set<TurningEvent> turningEvents) {
        this.turningEvents = turningEvents;
    }

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
