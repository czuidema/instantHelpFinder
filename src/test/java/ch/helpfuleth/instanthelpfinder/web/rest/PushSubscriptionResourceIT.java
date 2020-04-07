package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.InstantHelpFinderApp;
import ch.helpfuleth.instanthelpfinder.domain.PushSubscription;
import ch.helpfuleth.instanthelpfinder.repository.PushSubscriptionRepository;

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
 * Integration tests for the {@link PushSubscriptionResource} REST controller.
 */
@SpringBootTest(classes = InstantHelpFinderApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class PushSubscriptionResourceIT {

    private static final String DEFAULT_ENDPOINT = "AAAAAAAAAA";
    private static final String UPDATED_ENDPOINT = "BBBBBBBBBB";

    private static final String DEFAULT_AUTH = "AAAAAAAAAA";
    private static final String UPDATED_AUTH = "BBBBBBBBBB";

    private static final String DEFAULT_P_256_DH = "AAAAAAAAAA";
    private static final String UPDATED_P_256_DH = "BBBBBBBBBB";

    @Autowired
    private PushSubscriptionRepository pushSubscriptionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPushSubscriptionMockMvc;

    private PushSubscription pushSubscription;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PushSubscription createEntity(EntityManager em) {
        PushSubscription pushSubscription = new PushSubscription()
            .endpoint(DEFAULT_ENDPOINT)
            .auth(DEFAULT_AUTH)
            .p256dh(DEFAULT_P_256_DH);
        return pushSubscription;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PushSubscription createUpdatedEntity(EntityManager em) {
        PushSubscription pushSubscription = new PushSubscription()
            .endpoint(UPDATED_ENDPOINT)
            .auth(UPDATED_AUTH)
            .p256dh(UPDATED_P_256_DH);
        return pushSubscription;
    }

    @BeforeEach
    public void initTest() {
        pushSubscription = createEntity(em);
    }

    @Test
    @Transactional
    public void createPushSubscription() throws Exception {
        int databaseSizeBeforeCreate = pushSubscriptionRepository.findAll().size();

        // Create the PushSubscription
        restPushSubscriptionMockMvc.perform(post("/api/push-subscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pushSubscription)))
            .andExpect(status().isCreated());

        // Validate the PushSubscription in the database
        List<PushSubscription> pushSubscriptionList = pushSubscriptionRepository.findAll();
        assertThat(pushSubscriptionList).hasSize(databaseSizeBeforeCreate + 1);
        PushSubscription testPushSubscription = pushSubscriptionList.get(pushSubscriptionList.size() - 1);
        assertThat(testPushSubscription.getEndpoint()).isEqualTo(DEFAULT_ENDPOINT);
        assertThat(testPushSubscription.getAuth()).isEqualTo(DEFAULT_AUTH);
        assertThat(testPushSubscription.getp256dh()).isEqualTo(DEFAULT_P_256_DH);
    }

    @Test
    @Transactional
    public void createPushSubscriptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pushSubscriptionRepository.findAll().size();

        // Create the PushSubscription with an existing ID
        pushSubscription.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPushSubscriptionMockMvc.perform(post("/api/push-subscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pushSubscription)))
            .andExpect(status().isBadRequest());

        // Validate the PushSubscription in the database
        List<PushSubscription> pushSubscriptionList = pushSubscriptionRepository.findAll();
        assertThat(pushSubscriptionList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPushSubscriptions() throws Exception {
        // Initialize the database
        pushSubscriptionRepository.saveAndFlush(pushSubscription);

        // Get all the pushSubscriptionList
        restPushSubscriptionMockMvc.perform(get("/api/push-subscriptions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pushSubscription.getId().intValue())))
            .andExpect(jsonPath("$.[*].endpoint").value(hasItem(DEFAULT_ENDPOINT)))
            .andExpect(jsonPath("$.[*].auth").value(hasItem(DEFAULT_AUTH)))
            .andExpect(jsonPath("$.[*].p256dh").value(hasItem(DEFAULT_P_256_DH)));
    }
    
    @Test
    @Transactional
    public void getPushSubscription() throws Exception {
        // Initialize the database
        pushSubscriptionRepository.saveAndFlush(pushSubscription);

        // Get the pushSubscription
        restPushSubscriptionMockMvc.perform(get("/api/push-subscriptions/{id}", pushSubscription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pushSubscription.getId().intValue()))
            .andExpect(jsonPath("$.endpoint").value(DEFAULT_ENDPOINT))
            .andExpect(jsonPath("$.auth").value(DEFAULT_AUTH))
            .andExpect(jsonPath("$.p256dh").value(DEFAULT_P_256_DH));
    }

    @Test
    @Transactional
    public void getNonExistingPushSubscription() throws Exception {
        // Get the pushSubscription
        restPushSubscriptionMockMvc.perform(get("/api/push-subscriptions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePushSubscription() throws Exception {
        // Initialize the database
        pushSubscriptionRepository.saveAndFlush(pushSubscription);

        int databaseSizeBeforeUpdate = pushSubscriptionRepository.findAll().size();

        // Update the pushSubscription
        PushSubscription updatedPushSubscription = pushSubscriptionRepository.findById(pushSubscription.getId()).get();
        // Disconnect from session so that the updates on updatedPushSubscription are not directly saved in db
        em.detach(updatedPushSubscription);
        updatedPushSubscription
            .endpoint(UPDATED_ENDPOINT)
            .auth(UPDATED_AUTH)
            .p256dh(UPDATED_P_256_DH);

        restPushSubscriptionMockMvc.perform(put("/api/push-subscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPushSubscription)))
            .andExpect(status().isOk());

        // Validate the PushSubscription in the database
        List<PushSubscription> pushSubscriptionList = pushSubscriptionRepository.findAll();
        assertThat(pushSubscriptionList).hasSize(databaseSizeBeforeUpdate);
        PushSubscription testPushSubscription = pushSubscriptionList.get(pushSubscriptionList.size() - 1);
        assertThat(testPushSubscription.getEndpoint()).isEqualTo(UPDATED_ENDPOINT);
        assertThat(testPushSubscription.getAuth()).isEqualTo(UPDATED_AUTH);
        assertThat(testPushSubscription.getp256dh()).isEqualTo(UPDATED_P_256_DH);
    }

    @Test
    @Transactional
    public void updateNonExistingPushSubscription() throws Exception {
        int databaseSizeBeforeUpdate = pushSubscriptionRepository.findAll().size();

        // Create the PushSubscription

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPushSubscriptionMockMvc.perform(put("/api/push-subscriptions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(pushSubscription)))
            .andExpect(status().isBadRequest());

        // Validate the PushSubscription in the database
        List<PushSubscription> pushSubscriptionList = pushSubscriptionRepository.findAll();
        assertThat(pushSubscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePushSubscription() throws Exception {
        // Initialize the database
        pushSubscriptionRepository.saveAndFlush(pushSubscription);

        int databaseSizeBeforeDelete = pushSubscriptionRepository.findAll().size();

        // Delete the pushSubscription
        restPushSubscriptionMockMvc.perform(delete("/api/push-subscriptions/{id}", pushSubscription.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PushSubscription> pushSubscriptionList = pushSubscriptionRepository.findAll();
        assertThat(pushSubscriptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
