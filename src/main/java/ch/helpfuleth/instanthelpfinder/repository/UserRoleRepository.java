package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.UserRole;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UserRole entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
}
