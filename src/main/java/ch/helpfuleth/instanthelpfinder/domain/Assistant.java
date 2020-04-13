package ch.helpfuleth.instanthelpfinder.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.HashSet;
import java.util.Set;

/**
 * A Assistant.
 */
@Entity
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Assistant extends UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @ManyToMany(mappedBy = "assistants")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<TurningEvent> turningEvents = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    public Set<TurningEvent> getTurningEvents() {
        return turningEvents;
    }

    public Assistant turningEvents(Set<TurningEvent> turningEvents) {
        this.turningEvents = turningEvents;
        return this;
    }

    public Assistant addTurningEvents(TurningEvent turningEvent) {
        this.turningEvents.add(turningEvent);
        turningEvent.getAssistants().add(this);
        return this;
    }

    public Assistant removeTurningEvents(TurningEvent turningEvent) {
        this.turningEvents.remove(turningEvent);
        turningEvent.getAssistants().remove(this);
        return this;
    }

    public void setTurningEvents(Set<TurningEvent> turningEvents) {
        this.turningEvents = turningEvents;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Assistant)) {
            return false;
        }
        return getId() != null && getId().equals(((Assistant) o).getId());
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Assistant{" +
            "id=" + getId() +
            "}";
    }
}
