package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import ch.helpfuleth.instanthelpfinder.service.TurningEventService;
import ch.helpfuleth.instanthelpfinder.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link ch.helpfuleth.instanthelpfinder.domain.TurningEvent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TurningEventResource {

    private final Logger log = LoggerFactory.getLogger(TurningEventResource.class);

    private static final String ENTITY_NAME = "turningEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TurningEventRepository turningEventRepository;

    private final TurningEventService turningEventService;

    public TurningEventResource(
        TurningEventRepository turningEventRepository,
        TurningEventService turningEventService
        ) {
        this.turningEventRepository = turningEventRepository;
        this.turningEventService = turningEventService;
    }

    /**
     * {@code POST  /turning-events} : Create a new turningEvent.
     *
     * @param turningEvent the turningEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new turningEvent, or with status {@code 400 (Bad Request)} if the turningEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/turning-events")
    public ResponseEntity<TurningEvent> createTurningEvent(@RequestBody TurningEvent turningEvent) throws URISyntaxException {
        log.debug("REST request to save TurningEvent : {}", turningEvent);
        if (turningEvent.getId() != null) {
            throw new BadRequestAlertException("A new turningEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TurningEvent result = this.turningEventService.createNew(turningEvent);
        return ResponseEntity.created(new URI("/api/turning-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /turning-events} : Updates an existing turningEvent.
     *
     * @param turningEvent the turningEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated turningEvent,
     * or with status {@code 400 (Bad Request)} if the turningEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the turningEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/turning-events")
    public ResponseEntity<TurningEvent> updateTurningEvent(@RequestBody TurningEvent turningEvent) throws URISyntaxException {
        log.debug("REST request to update TurningEvent : {}", turningEvent);
        if (turningEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TurningEvent result = turningEventService.update(turningEvent);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, turningEvent.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /turning-events} : get all the turningEvents.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of turningEvents in body.
     */
    @GetMapping("/turning-events")
    public List<TurningEvent> getAllTurningEvents(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TurningEvents");
        return turningEventRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /turning-events/:id} : get the "id" turningEvent.
     *
     * @param id the id of the turningEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the turningEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/turning-events/{id}")
    public ResponseEntity<TurningEvent> getTurningEvent(@PathVariable Long id) {
        log.debug("REST request to get TurningEvent : {}", id);
        Optional<TurningEvent> turningEvent = turningEventRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(turningEvent);
    }

    /**
     * {@code DELETE  /turning-events/:id} : delete the "id" turningEvent.
     *
     * @param id the id of the turningEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/turning-events/{id}")
    public ResponseEntity<Void> deleteTurningEvent(@PathVariable Long id) {
        log.debug("REST request to delete TurningEvent : {}", id);
        turningEventRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
