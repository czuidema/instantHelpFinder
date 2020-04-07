package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.Assistant;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Assistant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssistantRepository extends JpaRepository<Assistant, Long> {
}
