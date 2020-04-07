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
@Table(name = "assistant")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Assistant extends UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @ManyToMany(mappedBy = "assistants")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Request> requests = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    public Set<Request> getRequests() {
        return requests;
    }

    public Assistant requests(Set<Request> requests) {
        this.requests = requests;
        return this;
    }

    public Assistant addRequests(Request request) {
        this.requests.add(request);
        request.getAssistants().add(this);
        return this;
    }

    public Assistant removeRequests(Request request) {
        this.requests.remove(request);
        request.getAssistants().remove(this);
        return this;
    }

    public void setRequests(Set<Request> requests) {
        this.requests = requests;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove


    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return super.toString() + "Assistant{" +
            "}";
    }
}
