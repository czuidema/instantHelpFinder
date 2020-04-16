package ch.helpfuleth.instanthelpfinder.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.*;



@Entity
@Table(name= "time_slot")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class TimeSlot implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long turningEventId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date slotStart;

    @Temporal(TemporalType.TIMESTAMP)
    private Date slotEnd;
}
