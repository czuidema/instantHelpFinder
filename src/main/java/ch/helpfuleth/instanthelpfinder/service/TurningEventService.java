package ch.helpfuleth.instanthelpfinder.service;

import ch.helpfuleth.instanthelpfinder.domain.Doctor;
import ch.helpfuleth.instanthelpfinder.domain.ICUNurse;
import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.domain.UserRole;
import ch.helpfuleth.instanthelpfinder.domain.enumeration.ETurningEventStatus;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import ch.helpfuleth.instanthelpfinder.repository.UserRoleRepository;
import ch.helpfuleth.instanthelpfinder.security.SecurityUtils;
import ch.helpfuleth.instanthelpfinder.service.event.OnTurningEventPublishedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TurningEventService {

    private final TurningEventRepository turningEventRepository;

    private final UserRoleRepository userRoleRepository;

    private final ApplicationEventPublisher applicationEventPublisher;

    public TurningEventService(
        TurningEventRepository turningEventRepository,
        UserRoleRepository userRoleRepository,
        ApplicationEventPublisher applicationEventPublisher
    ) {
        this.turningEventRepository = turningEventRepository;
        this.userRoleRepository = userRoleRepository;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public TurningEvent createNew(TurningEvent turningEvent) {
        turningEvent.setStatus(ETurningEventStatus.PENDING);

        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Could not get the logged in user."));
        UserRole userRole = userRoleRepository.findOneByUserLogin(currentUserLogin).orElseThrow(() -> new RuntimeException("UserRole for user with login " + currentUserLogin + " not found."));

        if (userRole instanceof Doctor) {
            turningEvent.setDoctor((Doctor) userRole);
        } else if (userRole instanceof ICUNurse) {
            turningEvent.setIcuNurse((ICUNurse) userRole);
        }

        try {
            applicationEventPublisher.publishEvent(new OnTurningEventPublishedEvent(turningEvent));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return turningEventRepository.save(turningEvent);
    }

    public TurningEvent update(TurningEvent turningEvent) {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("Could not get the logged in user."));
        userRoleRepository.findOneByUserLogin(currentUserLogin).orElseThrow(() -> new RuntimeException("UserRole for user with login " + currentUserLogin + " not found."));
        if (turningEvent.getStatus() == ETurningEventStatus.PENDING) {
            if(turningEvent.getDoctor() != null && turningEvent.getIcuNurse() != null) {

            }
        }
        return turningEventRepository.save(turningEvent);
    }
}
