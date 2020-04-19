package ch.helpfuleth.instanthelpfinder.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A UserRole.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "dtype")
@JsonSubTypes(value = {
    @JsonSubTypes.Type(name = "Doctor", value = Doctor.class),
    @JsonSubTypes.Type(name = "ICUNurse", value = ICUNurse.class),
    @JsonSubTypes.Type(name = "Assistant", value = Assistant.class),
})
@Entity
@Table(name = "user_role")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "availability")
    private Boolean availability;

    @OneToOne
    @JoinColumn(unique = true)
    private PushSubscription pushSubscription;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isAvailability() {
        return availability;
    }

    public UserRole availability(Boolean availability) {
        this.availability = availability;
        return this;
    }

    public void setAvailability(Boolean availability) {
        this.availability = availability;
    }

    public PushSubscription getPushSubscription() {
        return pushSubscription;
    }

    public UserRole pushSubscription(PushSubscription pushSubscription) {
        this.pushSubscription = pushSubscription;
        return this;
    }

    public void setPushSubscription(PushSubscription pushSubscription) {
        this.pushSubscription = pushSubscription;
    }

    public Boolean getAvailability() {
        return availability;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserRole)) {
            return false;
        }
        return id != null && id.equals(((UserRole) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "UserRole{" +
            "id=" + getId() +
            ", availability='" + isAvailability() + "'" +
            "}";
    }
}
