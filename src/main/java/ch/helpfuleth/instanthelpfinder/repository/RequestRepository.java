package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.Request;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Request entity.
 */
@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    @Query(value = "select distinct request from Request request left join fetch request.assistants",
        countQuery = "select count(distinct request) from Request request")
    Page<Request> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct request from Request request left join fetch request.assistants")
    List<Request> findAllWithEagerRelationships();

    @Query("select request from Request request left join fetch request.assistants where request.id =:id")
    Optional<Request> findOneWithEagerRelationships(@Param("id") Long id);
}
