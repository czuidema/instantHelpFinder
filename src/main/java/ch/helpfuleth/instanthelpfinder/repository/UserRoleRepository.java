package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.domain.UserRole;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data  repository for the UserRole entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {


    @Query("select userRole from UserRole userRole left join fetch userRole.user user where user.login = :userLogin")
    Optional<UserRole> findOneByUserLogin(@Param("userLogin") String userLogin);
}
