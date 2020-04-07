package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.PushSubscription;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the PushSubscription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
}
