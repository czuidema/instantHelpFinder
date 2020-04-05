package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.Authority;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
