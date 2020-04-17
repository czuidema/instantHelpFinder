package ch.helpfuleth.instanthelpfinder.domain;

import ch.helpfuleth.instanthelpfinder.domain.enumeration.ETurningEventStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.*;

import ch.helpfuleth.instanthelpfinder.domain.enumeration.EPriority;

/**
 * A TurningEvent.
 */
@Entity
@Table(name = "turning_event")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class TurningEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "patient_data")
    private String patientData;

    @Column(name = "ward")
    private String ward;

    @Column(name = "room_nr")
    private String roomNr;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private EPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ETurningEventStatus status;

    @ManyToOne
    @JsonIgnoreProperties("turningEvents")
    private Doctor doctor;

    @ManyToOne
    @JsonIgnoreProperties("turningEvents")
    private ICUNurse icuNurse;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "turning_event_assistants",
               joinColumns = @JoinColumn(name = "turning_event_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "assistants_id", referencedColumnName = "id"))
    private Set<Assistant> assistants = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties
    private Collection<TimeSlot> potentialTimeSlots;

    @OneToOne(fetch = FetchType.EAGER)
    private TimeSlot definiteTimeSlot;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove


    public ETurningEventStatus getStatus() {
        return status;
    }

    public void setStatus(ETurningEventStatus status) {
        this.status = status;
    }

    public TimeSlot getDefiniteTimeSlot() {
        return definiteTimeSlot;
    }

    public void setDefiniteTimeSlot(TimeSlot definiteTimeSlot) {
        this.definiteTimeSlot = definiteTimeSlot;
    }

    public Collection<TimeSlot> getPotentialTimeSlots() {
        return potentialTimeSlots;
    }

    public void setPotentialTimeSlots(Collection<TimeSlot> potentialTimeSlots) {
        this.potentialTimeSlots = potentialTimeSlots;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public TurningEvent patientName(String patientName) {
        this.patientName = patientName;
        return this;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientData() {
        return patientData;
    }

    public TurningEvent patientData(String patientData) {
        this.patientData = patientData;
        return this;
    }

    public void setPatientData(String patientData) {
        this.patientData = patientData;
    }

    public String getWard() {
        return ward;
    }

    public TurningEvent ward(String ward) {
        this.ward = ward;
        return this;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getRoomNr() {
        return roomNr;
    }

    public TurningEvent roomNr(String roomNr) {
        this.roomNr = roomNr;
        return this;
    }

    public void setRoomNr(String roomNr) {
        this.roomNr = roomNr;
    }

    public EPriority getPriority() {
        return priority;
    }

    public TurningEvent priority(EPriority priority) {
        this.priority = priority;
        return this;
    }

    public void setPriority(EPriority priority) {
        this.priority = priority;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public TurningEvent doctor(Doctor doctor) {
        this.doctor = doctor;
        return this;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public ICUNurse getIcuNurse() {
        return icuNurse;
    }

    public TurningEvent icuNurse(ICUNurse iCUNurse) {
        this.icuNurse = iCUNurse;
        return this;
    }

    public void setIcuNurse(ICUNurse iCUNurse) {
        this.icuNurse = iCUNurse;
    }

    public Set<Assistant> getAssistants() {
        return assistants;
    }

    public TurningEvent assistants(Set<Assistant> assistants) {
        this.assistants = assistants;
        return this;
    }

    public TurningEvent addAssistants(Assistant assistant) {
        this.assistants.add(assistant);
        assistant.getTurningEvents().add(this);
        return this;
    }

    public TurningEvent removeAssistants(Assistant assistant) {
        this.assistants.remove(assistant);
        assistant.getTurningEvents().remove(this);
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
        if (!(o instanceof TurningEvent)) {
            return false;
        }
        return id != null && id.equals(((TurningEvent) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "TurningEvent{" +
            "id=" + getId() +
            ", patientName='" + getPatientName() + "'" +
            ", patientData='" + getPatientData() + "'" +
            ", ward='" + getWard() + "'" +
            ", roomNr='" + getRoomNr() + "'" +
            ", priority='" + getPriority() + "'" +
            "}";
    }
}
