package ch.helpfuleth.instanthelpfinder.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Collection;
import java.util.Objects;

/**
 * A Doctor.
 */
@Entity
@Table(name = "doctor")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Doctor extends UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @OneToMany
    private Collection<Request> requests;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove


    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    public Collection<Request> getRequests() {
        return requests;
    }

    public void setRequests(Collection<Request> requests) {
        this.requests = requests;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Doctor)) {
            return false;
        }
        return false;
    }

    @Override
    public int hashCode() {
        return 31;
    }

}
