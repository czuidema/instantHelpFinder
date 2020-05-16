package ch.helpfuleth.instanthelpfinder.service.event;

import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import org.springframework.context.ApplicationEvent;

public class OnTurningEventPublishedEvent extends ApplicationEvent {

    private TurningEvent turningEvent;

    public OnTurningEventPublishedEvent(TurningEvent turningEvent) {
        super(turningEvent);
        this.turningEvent = turningEvent;
    }

    public TurningEvent getTurningEvent() {
        return turningEvent;
    }

    public void setTurningEvent(TurningEvent turningEvent) {
        this.turningEvent = turningEvent;
    }
}
