package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.ICUNurse;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ICUNurse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ICUNurseRepository extends JpaRepository<ICUNurse, Long> {
}
