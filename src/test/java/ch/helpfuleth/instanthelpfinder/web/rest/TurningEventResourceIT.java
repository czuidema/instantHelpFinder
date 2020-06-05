package ch.helpfuleth.instanthelpfinder.web.rest;

import ch.helpfuleth.instanthelpfinder.InstantHelpFinderApp;
import ch.helpfuleth.instanthelpfinder.domain.Doctor;
import ch.helpfuleth.instanthelpfinder.domain.TurningEvent;
import ch.helpfuleth.instanthelpfinder.domain.enumeration.EPriority;
import ch.helpfuleth.instanthelpfinder.repository.AssistantRepository;
import ch.helpfuleth.instanthelpfinder.repository.DoctorRepository;
import ch.helpfuleth.instanthelpfinder.repository.TimeSlotRepository;
import ch.helpfuleth.instanthelpfinder.repository.TurningEventRepository;
import ch.helpfuleth.instanthelpfinder.service.FlowableService;
import ch.helpfuleth.instanthelpfinder.service.TurningEventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link TurningEventResource} REST controller.
 */
@SpringBootTest(classes = InstantHelpFinderApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class TurningEventResourceIT {

    private static final String DEFAULT_PATIENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PATIENT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PATIENT_DATA = "AAAAAAAAAA";
    private static final String UPDATED_PATIENT_DATA = "BBBBBBBBBB";

    private static final String DEFAULT_WARD = "AAAAAAAAAA";
    private static final String UPDATED_WARD = "BBBBBBBBBB";

    private static final String DEFAULT_ROOM_NR = "AAAAAAAAAA";
    private static final String UPDATED_ROOM_NR = "BBBBBBBBBB";

    private static final EPriority DEFAULT_PRIORITY = EPriority.LOW;
    private static final EPriority UPDATED_PRIORITY = EPriority.HIGH;

    @Autowired
    private TurningEventRepository turningEventRepository;

    @Mock
    private TurningEventRepository turningEventRepositoryMock;

    @Autowired
    private TurningEventService turningEventService;

    @Mock
    private TurningEventService turningEventServiceMock;

    @Autowired
    private FlowableService flowableService;

    @Mock
    private FlowableService flowableServiceMock;

    @Autowired
    private DoctorRepository doctorRepository;

    @Mock
    private DoctorRepository doctorRepositoryMock;

    @Autowired
    private AssistantRepository assistantRepository;

    @Mock
    private AssistantRepository assistantRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTurningEventMockMvc;

    private TurningEvent turningEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TurningEvent createEntity(EntityManager em) {
        TurningEvent turningEvent = new TurningEvent()
            .patientName(DEFAULT_PATIENT_NAME)
            .patientData(DEFAULT_PATIENT_DATA)
            .ward(DEFAULT_WARD)
            .roomNr(DEFAULT_ROOM_NR)
            .priority(DEFAULT_PRIORITY);
        return turningEvent;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TurningEvent createUpdatedEntity(EntityManager em) {
        TurningEvent turningEvent = new TurningEvent()
            .patientName(UPDATED_PATIENT_NAME)
            .patientData(UPDATED_PATIENT_DATA)
            .ward(UPDATED_WARD)
            .roomNr(UPDATED_ROOM_NR)
            .priority(UPDATED_PRIORITY);
        return turningEvent;
    }

    @BeforeEach
    public void initTest() {
        turningEvent = createEntity(em);
    }

//  TODO: fix liquibase-User-without-userRole and remove ignore
//  @Test
    @Transactional
    public void createTurningEvent() throws Exception {
        int databaseSizeBeforeCreate = turningEventRepository.findAll().size();

        // Create the TurningEvent
        restTurningEventMockMvc.perform(post("/api/turning-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(turningEvent)))
            .andExpect(status().isCreated());

        // Validate the TurningEvent in the database
        List<TurningEvent> turningEventList = turningEventRepository.findAll();
        assertThat(turningEventList).hasSize(databaseSizeBeforeCreate + 1);
        TurningEvent testTurningEvent = turningEventList.get(turningEventList.size() - 1);
        assertThat(testTurningEvent.getPatientName()).isEqualTo(DEFAULT_PATIENT_NAME);
        assertThat(testTurningEvent.getPatientData()).isEqualTo(DEFAULT_PATIENT_DATA);
        assertThat(testTurningEvent.getWard()).isEqualTo(DEFAULT_WARD);
        assertThat(testTurningEvent.getRoomNr()).isEqualTo(DEFAULT_ROOM_NR);
        assertThat(testTurningEvent.getPriority()).isEqualTo(DEFAULT_PRIORITY);
    }

    @Test
    @Transactional
    public void createTurningEventWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = turningEventRepository.findAll().size();

        // Create the TurningEvent with an existing ID
        turningEvent.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTurningEventMockMvc.perform(post("/api/turning-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(turningEvent)))
            .andExpect(status().isBadRequest());

        // Validate the TurningEvent in the database
        List<TurningEvent> turningEventList = turningEventRepository.findAll();
        assertThat(turningEventList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllTurningEvents() throws Exception {
        // Initialize the database
        turningEventRepository.saveAndFlush(turningEvent);

        // Get all the turningEventList
        restTurningEventMockMvc.perform(get("/api/turning-events?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(turningEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].patientName").value(hasItem(DEFAULT_PATIENT_NAME)))
            .andExpect(jsonPath("$.[*].patientData").value(hasItem(DEFAULT_PATIENT_DATA)))
            .andExpect(jsonPath("$.[*].ward").value(hasItem(DEFAULT_WARD)))
            .andExpect(jsonPath("$.[*].roomNr").value(hasItem(DEFAULT_ROOM_NR)))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY.toString())));
    }

    @SuppressWarnings({"unchecked"})
    public void getAllTurningEventsWithEagerRelationshipsIsEnabled() throws Exception {
        TurningEventResource turningEventResource = new TurningEventResource(turningEventRepositoryMock, turningEventServiceMock, flowableServiceMock, doctorRepositoryMock, assistantRepositoryMock);
        when(turningEventRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTurningEventMockMvc.perform(get("/api/turning-events?eagerload=true"))
            .andExpect(status().isOk());

        verify(turningEventRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllTurningEventsWithEagerRelationshipsIsNotEnabled() throws Exception {
        TurningEventResource turningEventResource = new TurningEventResource(turningEventRepositoryMock, turningEventServiceMock, flowableServiceMock, doctorRepositoryMock, assistantRepositoryMock);
        when(turningEventRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTurningEventMockMvc.perform(get("/api/turning-events?eagerload=true"))
            .andExpect(status().isOk());

        verify(turningEventRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getTurningEvent() throws Exception {
        // Initialize the database
        turningEventRepository.saveAndFlush(turningEvent);

        // Get the turningEvent
        restTurningEventMockMvc.perform(get("/api/turning-events/{id}", turningEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(turningEvent.getId().intValue()))
            .andExpect(jsonPath("$.patientName").value(DEFAULT_PATIENT_NAME))
            .andExpect(jsonPath("$.patientData").value(DEFAULT_PATIENT_DATA))
            .andExpect(jsonPath("$.ward").value(DEFAULT_WARD))
            .andExpect(jsonPath("$.roomNr").value(DEFAULT_ROOM_NR))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTurningEvent() throws Exception {
        // Get the turningEvent
        restTurningEventMockMvc.perform(get("/api/turning-events/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

//    TODO: fix liquibase-User-without-userRole and remove ignore
//    @Test
    @Transactional
    public void updateTurningEvent() throws Exception {
        // Initialize the database
        turningEventRepository.saveAndFlush(turningEvent);

        int databaseSizeBeforeUpdate = turningEventRepository.findAll().size();

        // Update the turningEvent
        TurningEvent updatedTurningEvent = turningEventRepository.findById(turningEvent.getId()).get();
        // Disconnect from session so that the updates on updatedTurningEvent are not directly saved in db
        em.detach(updatedTurningEvent);
        updatedTurningEvent
            .patientName(UPDATED_PATIENT_NAME)
            .patientData(UPDATED_PATIENT_DATA)
            .ward(UPDATED_WARD)
            .roomNr(UPDATED_ROOM_NR)
            .priority(UPDATED_PRIORITY);

        restTurningEventMockMvc.perform(put("/api/turning-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTurningEvent)))
            .andExpect(status().isOk());

        // Validate the TurningEvent in the database
        List<TurningEvent> turningEventList = turningEventRepository.findAll();
        assertThat(turningEventList).hasSize(databaseSizeBeforeUpdate);
        TurningEvent testTurningEvent = turningEventList.get(turningEventList.size() - 1);
        assertThat(testTurningEvent.getPatientName()).isEqualTo(UPDATED_PATIENT_NAME);
        assertThat(testTurningEvent.getPatientData()).isEqualTo(UPDATED_PATIENT_DATA);
        assertThat(testTurningEvent.getWard()).isEqualTo(UPDATED_WARD);
        assertThat(testTurningEvent.getRoomNr()).isEqualTo(UPDATED_ROOM_NR);
        assertThat(testTurningEvent.getPriority()).isEqualTo(UPDATED_PRIORITY);
    }

    @Test
    @Transactional
    public void updateNonExistingTurningEvent() throws Exception {
        int databaseSizeBeforeUpdate = turningEventRepository.findAll().size();

        // Create the TurningEvent

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTurningEventMockMvc.perform(put("/api/turning-events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(turningEvent)))
            .andExpect(status().isBadRequest());

        // Validate the TurningEvent in the database
        List<TurningEvent> turningEventList = turningEventRepository.findAll();
        assertThat(turningEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTurningEvent() throws Exception {
        // Initialize the database
        turningEventRepository.saveAndFlush(turningEvent);

        int databaseSizeBeforeDelete = turningEventRepository.findAll().size();

        // Delete the turningEvent
        restTurningEventMockMvc.perform(delete("/api/turning-events/{id}", turningEvent.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TurningEvent> turningEventList = turningEventRepository.findAll();
        assertThat(turningEventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
