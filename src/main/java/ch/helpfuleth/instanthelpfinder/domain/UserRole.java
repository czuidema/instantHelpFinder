package ch.helpfuleth.instanthelpfinder.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A UserRole.
 */
@Entity
@Table(name = "user_role")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "d_type")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private PushSubscription pushSubscrioption;

    @OneToOne
    @JoinColumn(unique =  true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PushSubscription getPushSubscrioption() {
        return pushSubscrioption;
    }

    public UserRole pushSubscrioption(PushSubscription pushSubscription) {
        this.pushSubscrioption = pushSubscription;
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setPushSubscrioption(PushSubscription pushSubscription) {
        this.pushSubscrioption = pushSubscription;
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
            "}";
    }
}
