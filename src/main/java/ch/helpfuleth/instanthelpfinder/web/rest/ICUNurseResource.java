package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.domain.ICUNurse;
import ch.helpfuleth.instanthelpfinder.repository.ICUNurseRepository;
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
 * REST controller for managing {@link ch.helpfuleth.instanthelpfinder.domain.ICUNurse}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ICUNurseResource {

    private final Logger log = LoggerFactory.getLogger(ICUNurseResource.class);

    private static final String ENTITY_NAME = "iCUNurse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ICUNurseRepository iCUNurseRepository;

    public ICUNurseResource(ICUNurseRepository iCUNurseRepository) {
        this.iCUNurseRepository = iCUNurseRepository;
    }

    /**
     * {@code POST  /icu-nurses} : Create a new iCUNurse.
     *
     * @param iCUNurse the iCUNurse to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new iCUNurse, or with status {@code 400 (Bad Request)} if the iCUNurse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/icu-nurses")
    public ResponseEntity<ICUNurse> createICUNurse(@RequestBody ICUNurse iCUNurse) throws URISyntaxException {
        log.debug("REST request to save ICUNurse : {}", iCUNurse);
        if (iCUNurse.getId() != null) {
            throw new BadRequestAlertException("A new iCUNurse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ICUNurse result = iCUNurseRepository.save(iCUNurse);
        return ResponseEntity.created(new URI("/api/icu-nurses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /icu-nurses} : Updates an existing iCUNurse.
     *
     * @param iCUNurse the iCUNurse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated iCUNurse,
     * or with status {@code 400 (Bad Request)} if the iCUNurse is not valid,
     * or with status {@code 500 (Internal Server Error)} if the iCUNurse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/icu-nurses")
    public ResponseEntity<ICUNurse> updateICUNurse(@RequestBody ICUNurse iCUNurse) throws URISyntaxException {
        log.debug("REST request to update ICUNurse : {}", iCUNurse);
        if (iCUNurse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ICUNurse result = iCUNurseRepository.save(iCUNurse);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, iCUNurse.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /icu-nurses} : get all the iCUNurses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of iCUNurses in body.
     */
    @GetMapping("/icu-nurses")
    public List<ICUNurse> getAllICUNurses() {
        log.debug("REST request to get all ICUNurses");
        return iCUNurseRepository.findAll();
    }

    /**
     * {@code GET  /icu-nurses/:id} : get the "id" iCUNurse.
     *
     * @param id the id of the iCUNurse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the iCUNurse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/icu-nurses/{id}")
    public ResponseEntity<ICUNurse> getICUNurse(@PathVariable Long id) {
        log.debug("REST request to get ICUNurse : {}", id);
        Optional<ICUNurse> iCUNurse = iCUNurseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(iCUNurse);
    }

    /**
     * {@code DELETE  /icu-nurses/:id} : delete the "id" iCUNurse.
     *
     * @param id the id of the iCUNurse to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/icu-nurses/{id}")
    public ResponseEntity<Void> deleteICUNurse(@PathVariable Long id) {
        log.debug("REST request to delete ICUNurse : {}", id);
        iCUNurseRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
