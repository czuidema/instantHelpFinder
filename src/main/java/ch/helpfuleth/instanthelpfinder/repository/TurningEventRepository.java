package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the TurningEvent entity.
 */
@Repository
public interface TurningEventRepository extends JpaRepository<TurningEvent, Long> {

    @Query(value = "select distinct turningEvent from TurningEvent turningEvent left join fetch turningEvent.assistants",
        countQuery = "select count(distinct turningEvent) from TurningEvent turningEvent")
    Page<TurningEvent> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct turningEvent from TurningEvent turningEvent left join fetch turningEvent.assistants")
    List<TurningEvent> findAllWithEagerRelationships();

    @Query("select turningEvent from TurningEvent turningEvent left join fetch turningEvent.assistants where turningEvent.id =:id")
    Optional<TurningEvent> findOneWithEagerRelationships(@Param("id") Long id);
}
