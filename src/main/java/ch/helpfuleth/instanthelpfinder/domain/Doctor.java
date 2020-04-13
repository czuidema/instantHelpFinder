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
 * A Doctor.
 */
@Entity
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Doctor extends UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "is_preferred_doctor")
    private Boolean isPreferredDoctor;

    @ManyToMany(mappedBy = "assistants")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<TurningEvent> turningEvents = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    public Boolean isIsPreferredDoctor() {
        return isPreferredDoctor;
    }

    public Doctor isPreferredDoctor(Boolean isPreferredDoctor) {
        this.isPreferredDoctor = isPreferredDoctor;
        return this;
    }

    public void setIsPreferredDoctor(Boolean isPreferredDoctor) {
        this.isPreferredDoctor = isPreferredDoctor;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Doctor)) {
            return false;
        }
        return getId() != null && getId().equals(((Doctor) o).getId());
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Doctor{" +
            "id=" + getId() +
            ", isPreferredDoctor='" + isIsPreferredDoctor() + "'" +
            "}";
    }
}
