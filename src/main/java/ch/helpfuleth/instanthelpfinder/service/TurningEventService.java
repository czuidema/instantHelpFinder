package ch.helpfuleth.instanthelpfinder.service;

import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.domain.UserRole;
import ch.helpfuleth.instanthelpfinder.domain.enumeration.ETurningEventStatus;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import ch.helpfuleth.instanthelpfinder.repository.UserRoleRepository;
import ch.helpfuleth.instanthelpfinder.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TurningEventService {

    private final TurningEventRepository turningEventRepository;

    private final UserRoleRepository userRoleRepository;

    public TurningEventService(
        TurningEventRepository turningEventRepository,
        UserRoleRepository userRoleRepository
    ) {
        this.turningEventRepository = turningEventRepository;
        this.userRoleRepository = userRoleRepository;
    }

    public TurningEvent createNew(TurningEvent turningEvent) {
        turningEvent.setStatus(ETurningEventStatus.PENDING);
        return turningEventRepository.save(turningEvent);
    }

    public TurningEvent update(TurningEvent turningEvent) {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Could not get the logged in user."));
        UserRole userRole = userRoleRepository.findOneByUserLogin(currentUserLogin).orElseThrow(() -> new RuntimeException("UserRole for user with login " + currentUserLogin + " not found."));
        if (turningEvent.getStatus() == ETurningEventStatus.PENDING) {
            if(turningEvent.getDoctor() != null && turningEvent.getIcuNurse() != null) {

            }
        }
        return turningEventRepository.save(turningEvent);
    }
}
