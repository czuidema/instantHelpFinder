package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.InstantHelpFinderApp;
import ch.helpfuleth.instanthelpfinder.domain.Assistant;
import ch.helpfuleth.instanthelpfinder.repository.AssistantRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link AssistantResource} REST controller.
 */
@SpringBootTest(classes = InstantHelpFinderApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class AssistantResourceIT {

    @Autowired
    private AssistantRepository assistantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAssistantMockMvc;

    private Assistant assistant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Assistant createEntity(EntityManager em) {
        Assistant assistant = new Assistant();
        return assistant;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Assistant createUpdatedEntity(EntityManager em) {
        Assistant assistant = new Assistant();
        return assistant;
    }

    @BeforeEach
    public void initTest() {
        assistant = createEntity(em);
    }

    @Test
    @Transactional
    public void createAssistant() throws Exception {
        int databaseSizeBeforeCreate = assistantRepository.findAll().size();

        // Create the Assistant
        restAssistantMockMvc.perform(post("/api/assistants")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(assistant)))
            .andExpect(status().isCreated());

        // Validate the Assistant in the database
        List<Assistant> assistantList = assistantRepository.findAll();
        assertThat(assistantList).hasSize(databaseSizeBeforeCreate + 1);
        Assistant testAssistant = assistantList.get(assistantList.size() - 1);
    }

    @Test
    @Transactional
    public void createAssistantWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = assistantRepository.findAll().size();

        // Create the Assistant with an existing ID
        assistant.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssistantMockMvc.perform(post("/api/assistants")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(assistant)))
            .andExpect(status().isBadRequest());

        // Validate the Assistant in the database
        List<Assistant> assistantList = assistantRepository.findAll();
        assertThat(assistantList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllAssistants() throws Exception {
        // Initialize the database
        assistantRepository.saveAndFlush(assistant);

        // Get all the assistantList
        restAssistantMockMvc.perform(get("/api/assistants?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(assistant.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getAssistant() throws Exception {
        // Initialize the database
        assistantRepository.saveAndFlush(assistant);

        // Get the assistant
        restAssistantMockMvc.perform(get("/api/assistants/{id}", assistant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(assistant.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAssistant() throws Exception {
        // Get the assistant
        restAssistantMockMvc.perform(get("/api/assistants/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAssistant() throws Exception {
        // Initialize the database
        assistantRepository.saveAndFlush(assistant);

        int databaseSizeBeforeUpdate = assistantRepository.findAll().size();

        // Update the assistant
        Assistant updatedAssistant = assistantRepository.findById(assistant.getId()).get();
        // Disconnect from session so that the updates on updatedAssistant are not directly saved in db
        em.detach(updatedAssistant);

        restAssistantMockMvc.perform(put("/api/assistants")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedAssistant)))
            .andExpect(status().isOk());

        // Validate the Assistant in the database
        List<Assistant> assistantList = assistantRepository.findAll();
        assertThat(assistantList).hasSize(databaseSizeBeforeUpdate);
        Assistant testAssistant = assistantList.get(assistantList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingAssistant() throws Exception {
        int databaseSizeBeforeUpdate = assistantRepository.findAll().size();

        // Create the Assistant

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssistantMockMvc.perform(put("/api/assistants")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(assistant)))
            .andExpect(status().isBadRequest());

        // Validate the Assistant in the database
        List<Assistant> assistantList = assistantRepository.findAll();
        assertThat(assistantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAssistant() throws Exception {
        // Initialize the database
        assistantRepository.saveAndFlush(assistant);

        int databaseSizeBeforeDelete = assistantRepository.findAll().size();

        // Delete the assistant
        restAssistantMockMvc.perform(delete("/api/assistants/{id}", assistant.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Assistant> assistantList = assistantRepository.findAll();
        assertThat(assistantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
