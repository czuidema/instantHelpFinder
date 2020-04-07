package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.domain.Assistant;
import ch.helpfuleth.instanthelpfinder.repository.AssistantRepository;
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
 * REST controller for managing {@link ch.helpfuleth.instanthelpfinder.domain.Assistant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AssistantResource {

    private final Logger log = LoggerFactory.getLogger(AssistantResource.class);

    private static final String ENTITY_NAME = "assistant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AssistantRepository assistantRepository;

    public AssistantResource(AssistantRepository assistantRepository) {
        this.assistantRepository = assistantRepository;
    }

    /**
     * {@code POST  /assistants} : Create a new assistant.
     *
     * @param assistant the assistant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new assistant, or with status {@code 400 (Bad Request)} if the assistant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/assistants")
    public ResponseEntity<Assistant> createAssistant(@RequestBody Assistant assistant) throws URISyntaxException {
        log.debug("REST request to save Assistant : {}", assistant);
        if (assistant.getId() != null) {
            throw new BadRequestAlertException("A new assistant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Assistant result = assistantRepository.save(assistant);
        return ResponseEntity.created(new URI("/api/assistants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /assistants} : Updates an existing assistant.
     *
     * @param assistant the assistant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated assistant,
     * or with status {@code 400 (Bad Request)} if the assistant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the assistant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/assistants")
    public ResponseEntity<Assistant> updateAssistant(@RequestBody Assistant assistant) throws URISyntaxException {
        log.debug("REST request to update Assistant : {}", assistant);
        if (assistant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Assistant result = assistantRepository.save(assistant);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, assistant.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /assistants} : get all the assistants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of assistants in body.
     */
    @GetMapping("/assistants")
    public List<Assistant> getAllAssistants() {
        log.debug("REST request to get all Assistants");
        return assistantRepository.findAll();
    }

    /**
     * {@code GET  /assistants/:id} : get the "id" assistant.
     *
     * @param id the id of the assistant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the assistant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/assistants/{id}")
    public ResponseEntity<Assistant> getAssistant(@PathVariable Long id) {
        log.debug("REST request to get Assistant : {}", id);
        Optional<Assistant> assistant = assistantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(assistant);
    }

    /**
     * {@code DELETE  /assistants/:id} : delete the "id" assistant.
     *
     * @param id the id of the assistant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/assistants/{id}")
    public ResponseEntity<Void> deleteAssistant(@PathVariable Long id) {
        log.debug("REST request to delete Assistant : {}", id);
        assistantRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
