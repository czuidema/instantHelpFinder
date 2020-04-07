package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.InstantHelpFinderApp;
import ch.helpfuleth.instanthelpfinder.domain.ICUNurse;
import ch.helpfuleth.instanthelpfinder.repository.ICUNurseRepository;

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
 * Integration tests for the {@link ICUNurseResource} REST controller.
 */
@SpringBootTest(classes = InstantHelpFinderApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class ICUNurseResourceIT {

    @Autowired
    private ICUNurseRepository iCUNurseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restICUNurseMockMvc;

    private ICUNurse iCUNurse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ICUNurse createEntity(EntityManager em) {
        ICUNurse iCUNurse = new ICUNurse();
        return iCUNurse;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ICUNurse createUpdatedEntity(EntityManager em) {
        ICUNurse iCUNurse = new ICUNurse();
        return iCUNurse;
    }

    @BeforeEach
    public void initTest() {
        iCUNurse = createEntity(em);
    }

    @Test
    @Transactional
    public void createICUNurse() throws Exception {
        int databaseSizeBeforeCreate = iCUNurseRepository.findAll().size();

        // Create the ICUNurse
        restICUNurseMockMvc.perform(post("/api/icu-nurses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(iCUNurse)))
            .andExpect(status().isCreated());

        // Validate the ICUNurse in the database
        List<ICUNurse> iCUNurseList = iCUNurseRepository.findAll();
        assertThat(iCUNurseList).hasSize(databaseSizeBeforeCreate + 1);
        ICUNurse testICUNurse = iCUNurseList.get(iCUNurseList.size() - 1);
    }

    @Test
    @Transactional
    public void createICUNurseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = iCUNurseRepository.findAll().size();

        // Create the ICUNurse with an existing ID
        iCUNurse.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restICUNurseMockMvc.perform(post("/api/icu-nurses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(iCUNurse)))
            .andExpect(status().isBadRequest());

        // Validate the ICUNurse in the database
        List<ICUNurse> iCUNurseList = iCUNurseRepository.findAll();
        assertThat(iCUNurseList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllICUNurses() throws Exception {
        // Initialize the database
        iCUNurseRepository.saveAndFlush(iCUNurse);

        // Get all the iCUNurseList
        restICUNurseMockMvc.perform(get("/api/icu-nurses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(iCUNurse.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getICUNurse() throws Exception {
        // Initialize the database
        iCUNurseRepository.saveAndFlush(iCUNurse);

        // Get the iCUNurse
        restICUNurseMockMvc.perform(get("/api/icu-nurses/{id}", iCUNurse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(iCUNurse.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingICUNurse() throws Exception {
        // Get the iCUNurse
        restICUNurseMockMvc.perform(get("/api/icu-nurses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateICUNurse() throws Exception {
        // Initialize the database
        iCUNurseRepository.saveAndFlush(iCUNurse);

        int databaseSizeBeforeUpdate = iCUNurseRepository.findAll().size();

        // Update the iCUNurse
        ICUNurse updatedICUNurse = iCUNurseRepository.findById(iCUNurse.getId()).get();
        // Disconnect from session so that the updates on updatedICUNurse are not directly saved in db
        em.detach(updatedICUNurse);

        restICUNurseMockMvc.perform(put("/api/icu-nurses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedICUNurse)))
            .andExpect(status().isOk());

        // Validate the ICUNurse in the database
        List<ICUNurse> iCUNurseList = iCUNurseRepository.findAll();
        assertThat(iCUNurseList).hasSize(databaseSizeBeforeUpdate);
        ICUNurse testICUNurse = iCUNurseList.get(iCUNurseList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingICUNurse() throws Exception {
        int databaseSizeBeforeUpdate = iCUNurseRepository.findAll().size();

        // Create the ICUNurse

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restICUNurseMockMvc.perform(put("/api/icu-nurses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(iCUNurse)))
            .andExpect(status().isBadRequest());

        // Validate the ICUNurse in the database
        List<ICUNurse> iCUNurseList = iCUNurseRepository.findAll();
        assertThat(iCUNurseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteICUNurse() throws Exception {
        // Initialize the database
        iCUNurseRepository.saveAndFlush(iCUNurse);

        int databaseSizeBeforeDelete = iCUNurseRepository.findAll().size();

        // Delete the iCUNurse
        restICUNurseMockMvc.perform(delete("/api/icu-nurses/{id}", iCUNurse.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ICUNurse> iCUNurseList = iCUNurseRepository.findAll();
        assertThat(iCUNurseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
