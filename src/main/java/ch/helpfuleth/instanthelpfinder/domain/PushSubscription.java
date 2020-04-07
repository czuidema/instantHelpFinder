package ch.helpfuleth.instanthelpfinder.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A PushSubscription.
 */
@Entity
@Table(name = "push_subscription")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class PushSubscription implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "endpoint")
    private String endpoint;

    @Column(name = "auth")
    private String auth;

    @Column(name = "p_256_dh")
    private String p256dh;

    @OneToOne(mappedBy = "pushSubscrioption")
    @JsonIgnore
    private UserRole userRole;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public PushSubscription endpoint(String endpoint) {
        this.endpoint = endpoint;
        return this;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getAuth() {
        return auth;
    }

    public PushSubscription auth(String auth) {
        this.auth = auth;
        return this;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public String getp256dh() {
        return p256dh;
    }

    public PushSubscription p256dh(String p256dh) {
        this.p256dh = p256dh;
        return this;
    }

    public void setp256dh(String p256dh) {
        this.p256dh = p256dh;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public PushSubscription userRole(UserRole userRole) {
        this.userRole = userRole;
        return this;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PushSubscription)) {
            return false;
        }
        return id != null && id.equals(((PushSubscription) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "PushSubscription{" +
            "id=" + getId() +
            ", endpoint='" + getEndpoint() + "'" +
            ", auth='" + getAuth() + "'" +
            ", p256dh='" + getp256dh() + "'" +
            "}";
    }
}
