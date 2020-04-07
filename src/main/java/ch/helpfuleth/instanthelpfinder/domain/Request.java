package ch.helpfuleth.instanthelpfinder.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.HashSet;
import java.util.Set;

/**
 * A Request.
 */
@Entity
@Table(name = "request")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Request implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location")
    private String location;

    @ManyToOne
    @JsonIgnoreProperties("requests")
    private Doctor doctor;

    @ManyToOne
    @JsonIgnoreProperties("requests")
    private ICUNurse icuNurse;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "request_assistants",
               joinColumns = @JoinColumn(name = "request_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "assistants_id", referencedColumnName = "id"))
    private Set<Assistant> assistants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public Request location(String location) {
        this.location = location;
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public Request doctor(Doctor doctor) {
        this.doctor = doctor;
        return this;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public ICUNurse getIcuNurse() {
        return icuNurse;
    }

    public Request icuNurse(ICUNurse iCUNurse) {
        this.icuNurse = iCUNurse;
        return this;
    }

    public void setIcuNurse(ICUNurse iCUNurse) {
        this.icuNurse = iCUNurse;
    }

    public Set<Assistant> getAssistants() {
        return assistants;
    }

    public Request assistants(Set<Assistant> assistants) {
        this.assistants = assistants;
        return this;
    }

    public Request addAssistants(Assistant assistant) {
        this.assistants.add(assistant);
        assistant.getRequests().add(this);
        return this;
    }

    public Request removeAssistants(Assistant assistant) {
        this.assistants.remove(assistant);
        assistant.getRequests().remove(this);
        return this;
    }

    public void setAssistants(Set<Assistant> assistants) {
        this.assistants = assistants;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Request)) {
            return false;
        }
        return id != null && id.equals(((Request) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Request{" +
            "id=" + getId() +
            ", location='" + getLocation() + "'" +
            "}";
    }
}
