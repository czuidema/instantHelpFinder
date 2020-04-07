package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.domain.PushSubscription;
import ch.helpfuleth.instanthelpfinder.repository.PushSubscriptionRepository;
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
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing {@link ch.helpfuleth.instanthelpfinder.domain.PushSubscription}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PushSubscriptionResource {

    private final Logger log = LoggerFactory.getLogger(PushSubscriptionResource.class);

    private static final String ENTITY_NAME = "pushSubscription";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PushSubscriptionRepository pushSubscriptionRepository;

    public PushSubscriptionResource(PushSubscriptionRepository pushSubscriptionRepository) {
        this.pushSubscriptionRepository = pushSubscriptionRepository;
    }

    /**
     * {@code POST  /push-subscriptions} : Create a new pushSubscription.
     *
     * @param pushSubscription the pushSubscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pushSubscription, or with status {@code 400 (Bad Request)} if the pushSubscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/push-subscriptions")
    public ResponseEntity<PushSubscription> createPushSubscription(@RequestBody PushSubscription pushSubscription) throws URISyntaxException {
        log.debug("REST request to save PushSubscription : {}", pushSubscription);
        if (pushSubscription.getId() != null) {
            throw new BadRequestAlertException("A new pushSubscription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PushSubscription result = pushSubscriptionRepository.save(pushSubscription);
        return ResponseEntity.created(new URI("/api/push-subscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /push-subscriptions} : Updates an existing pushSubscription.
     *
     * @param pushSubscription the pushSubscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pushSubscription,
     * or with status {@code 400 (Bad Request)} if the pushSubscription is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pushSubscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/push-subscriptions")
    public ResponseEntity<PushSubscription> updatePushSubscription(@RequestBody PushSubscription pushSubscription) throws URISyntaxException {
        log.debug("REST request to update PushSubscription : {}", pushSubscription);
        if (pushSubscription.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PushSubscription result = pushSubscriptionRepository.save(pushSubscription);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pushSubscription.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /push-subscriptions} : get all the pushSubscriptions.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pushSubscriptions in body.
     */
    @GetMapping("/push-subscriptions")
    public List<PushSubscription> getAllPushSubscriptions(@RequestParam(required = false) String filter) {
        if ("userrole-is-null".equals(filter)) {
            log.debug("REST request to get all PushSubscriptions where userRole is null");
            return StreamSupport
                .stream(pushSubscriptionRepository.findAll().spliterator(), false)
                .filter(pushSubscription -> pushSubscription.getUserRole() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all PushSubscriptions");
        return pushSubscriptionRepository.findAll();
    }

    /**
     * {@code GET  /push-subscriptions/:id} : get the "id" pushSubscription.
     *
     * @param id the id of the pushSubscription to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pushSubscription, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/push-subscriptions/{id}")
    public ResponseEntity<PushSubscription> getPushSubscription(@PathVariable Long id) {
        log.debug("REST request to get PushSubscription : {}", id);
        Optional<PushSubscription> pushSubscription = pushSubscriptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pushSubscription);
    }

    /**
     * {@code DELETE  /push-subscriptions/:id} : delete the "id" pushSubscription.
     *
     * @param id the id of the pushSubscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/push-subscriptions/{id}")
    public ResponseEntity<Void> deletePushSubscription(@PathVariable Long id) {
        log.debug("REST request to delete PushSubscription : {}", id);
        pushSubscriptionRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
