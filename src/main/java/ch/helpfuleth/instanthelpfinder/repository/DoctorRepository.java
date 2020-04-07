package ch.helpfuleth.instanthelpfinder.repository;

import ch.helpfuleth.instanthelpfinder.domain.Doctor;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Doctor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
