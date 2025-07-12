package dev.flonixa.com.web.rest;

import static dev.flonixa.com.domain.GridColumnAsserts.*;
import static dev.flonixa.com.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.flonixa.com.IntegrationTest;
import dev.flonixa.com.domain.GridColumn;
import dev.flonixa.com.repository.EntityManager;
import dev.flonixa.com.repository.GridColumnRepository;
import dev.flonixa.com.service.GridColumnService;
import dev.flonixa.com.service.dto.GridColumnDTO;
import dev.flonixa.com.service.mapper.GridColumnMapper;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;

/**
 * Integration tests for the {@link GridColumnResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class GridColumnResourceIT {

    private static final String DEFAULT_DATA_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_DATA_FIELD = "BBBBBBBBBB";

    private static final String DEFAULT_CAPTION = "AAAAAAAAAA";
    private static final String UPDATED_CAPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_VISIBLE = false;
    private static final Boolean UPDATED_VISIBLE = true;

    private static final String DEFAULT_DATA_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_DATA_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_FORMAT = "AAAAAAAAAA";
    private static final String UPDATED_FORMAT = "BBBBBBBBBB";

    private static final Integer DEFAULT_WIDTH = 1;
    private static final Integer UPDATED_WIDTH = 2;

    private static final Boolean DEFAULT_ALLOW_SORTING = false;
    private static final Boolean UPDATED_ALLOW_SORTING = true;

    private static final Boolean DEFAULT_ALLOW_FILTERING = false;
    private static final Boolean UPDATED_ALLOW_FILTERING = true;

    private static final String ENTITY_API_URL = "/api/grid-columns";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GridColumnRepository gridColumnRepository;

    @Mock
    private GridColumnRepository gridColumnRepositoryMock;

    @Autowired
    private GridColumnMapper gridColumnMapper;

    @Mock
    private GridColumnService gridColumnServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private GridColumn gridColumn;

    private GridColumn insertedGridColumn;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GridColumn createEntity() {
        return new GridColumn()
            .dataField(DEFAULT_DATA_FIELD)
            .caption(DEFAULT_CAPTION)
            .visible(DEFAULT_VISIBLE)
            .dataType(DEFAULT_DATA_TYPE)
            .format(DEFAULT_FORMAT)
            .width(DEFAULT_WIDTH)
            .allowSorting(DEFAULT_ALLOW_SORTING)
            .allowFiltering(DEFAULT_ALLOW_FILTERING);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GridColumn createUpdatedEntity() {
        return new GridColumn()
            .dataField(UPDATED_DATA_FIELD)
            .caption(UPDATED_CAPTION)
            .visible(UPDATED_VISIBLE)
            .dataType(UPDATED_DATA_TYPE)
            .format(UPDATED_FORMAT)
            .width(UPDATED_WIDTH)
            .allowSorting(UPDATED_ALLOW_SORTING)
            .allowFiltering(UPDATED_ALLOW_FILTERING);
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(GridColumn.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @BeforeEach
    void initTest() {
        gridColumn = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedGridColumn != null) {
            gridColumnRepository.delete(insertedGridColumn).block();
            insertedGridColumn = null;
        }
        deleteEntities(em);
    }

    @Test
    void createGridColumn() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the GridColumn
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);
        var returnedGridColumnDTO = webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isCreated()
            .expectBody(GridColumnDTO.class)
            .returnResult()
            .getResponseBody();

        // Validate the GridColumn in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedGridColumn = gridColumnMapper.toEntity(returnedGridColumnDTO);
        assertGridColumnUpdatableFieldsEquals(returnedGridColumn, getPersistedGridColumn(returnedGridColumn));

        insertedGridColumn = returnedGridColumn;
    }

    @Test
    void createGridColumnWithExistingId() throws Exception {
        // Create the GridColumn with an existing ID
        gridColumn.setId(1L);
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridColumn in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkDataFieldIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        gridColumn.setDataField(null);

        // Create the GridColumn, which fails.
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllGridColumns() {
        // Initialize the database
        insertedGridColumn = gridColumnRepository.save(gridColumn).block();

        // Get all the gridColumnList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(gridColumn.getId().intValue()))
            .jsonPath("$.[*].dataField")
            .value(hasItem(DEFAULT_DATA_FIELD))
            .jsonPath("$.[*].caption")
            .value(hasItem(DEFAULT_CAPTION))
            .jsonPath("$.[*].visible")
            .value(hasItem(DEFAULT_VISIBLE))
            .jsonPath("$.[*].dataType")
            .value(hasItem(DEFAULT_DATA_TYPE))
            .jsonPath("$.[*].format")
            .value(hasItem(DEFAULT_FORMAT))
            .jsonPath("$.[*].width")
            .value(hasItem(DEFAULT_WIDTH))
            .jsonPath("$.[*].allowSorting")
            .value(hasItem(DEFAULT_ALLOW_SORTING))
            .jsonPath("$.[*].allowFiltering")
            .value(hasItem(DEFAULT_ALLOW_FILTERING));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGridColumnsWithEagerRelationshipsIsEnabled() {
        when(gridColumnServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(gridColumnServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGridColumnsWithEagerRelationshipsIsNotEnabled() {
        when(gridColumnServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(gridColumnRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getGridColumn() {
        // Initialize the database
        insertedGridColumn = gridColumnRepository.save(gridColumn).block();

        // Get the gridColumn
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, gridColumn.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(gridColumn.getId().intValue()))
            .jsonPath("$.dataField")
            .value(is(DEFAULT_DATA_FIELD))
            .jsonPath("$.caption")
            .value(is(DEFAULT_CAPTION))
            .jsonPath("$.visible")
            .value(is(DEFAULT_VISIBLE))
            .jsonPath("$.dataType")
            .value(is(DEFAULT_DATA_TYPE))
            .jsonPath("$.format")
            .value(is(DEFAULT_FORMAT))
            .jsonPath("$.width")
            .value(is(DEFAULT_WIDTH))
            .jsonPath("$.allowSorting")
            .value(is(DEFAULT_ALLOW_SORTING))
            .jsonPath("$.allowFiltering")
            .value(is(DEFAULT_ALLOW_FILTERING));
    }

    @Test
    void getNonExistingGridColumn() {
        // Get the gridColumn
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingGridColumn() throws Exception {
        // Initialize the database
        insertedGridColumn = gridColumnRepository.save(gridColumn).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridColumn
        GridColumn updatedGridColumn = gridColumnRepository.findById(gridColumn.getId()).block();
        updatedGridColumn
            .dataField(UPDATED_DATA_FIELD)
            .caption(UPDATED_CAPTION)
            .visible(UPDATED_VISIBLE)
            .dataType(UPDATED_DATA_TYPE)
            .format(UPDATED_FORMAT)
            .width(UPDATED_WIDTH)
            .allowSorting(UPDATED_ALLOW_SORTING)
            .allowFiltering(UPDATED_ALLOW_FILTERING);
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(updatedGridColumn);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, gridColumnDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridColumn in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGridColumnToMatchAllProperties(updatedGridColumn);
    }

    @Test
    void putNonExistingGridColumn() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridColumn.setId(longCount.incrementAndGet());

        // Create the GridColumn
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, gridColumnDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridColumn in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchGridColumn() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridColumn.setId(longCount.incrementAndGet());

        // Create the GridColumn
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridColumn in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamGridColumn() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridColumn.setId(longCount.incrementAndGet());

        // Create the GridColumn
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the GridColumn in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateGridColumnWithPatch() throws Exception {
        // Initialize the database
        insertedGridColumn = gridColumnRepository.save(gridColumn).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridColumn using partial update
        GridColumn partialUpdatedGridColumn = new GridColumn();
        partialUpdatedGridColumn.setId(gridColumn.getId());

        partialUpdatedGridColumn
            .dataField(UPDATED_DATA_FIELD)
            .caption(UPDATED_CAPTION)
            .visible(UPDATED_VISIBLE)
            .dataType(UPDATED_DATA_TYPE)
            .format(UPDATED_FORMAT)
            .width(UPDATED_WIDTH)
            .allowFiltering(UPDATED_ALLOW_FILTERING);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedGridColumn.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedGridColumn))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridColumn in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGridColumnUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedGridColumn, gridColumn),
            getPersistedGridColumn(gridColumn)
        );
    }

    @Test
    void fullUpdateGridColumnWithPatch() throws Exception {
        // Initialize the database
        insertedGridColumn = gridColumnRepository.save(gridColumn).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridColumn using partial update
        GridColumn partialUpdatedGridColumn = new GridColumn();
        partialUpdatedGridColumn.setId(gridColumn.getId());

        partialUpdatedGridColumn
            .dataField(UPDATED_DATA_FIELD)
            .caption(UPDATED_CAPTION)
            .visible(UPDATED_VISIBLE)
            .dataType(UPDATED_DATA_TYPE)
            .format(UPDATED_FORMAT)
            .width(UPDATED_WIDTH)
            .allowSorting(UPDATED_ALLOW_SORTING)
            .allowFiltering(UPDATED_ALLOW_FILTERING);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedGridColumn.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedGridColumn))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridColumn in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGridColumnUpdatableFieldsEquals(partialUpdatedGridColumn, getPersistedGridColumn(partialUpdatedGridColumn));
    }

    @Test
    void patchNonExistingGridColumn() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridColumn.setId(longCount.incrementAndGet());

        // Create the GridColumn
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, gridColumnDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridColumn in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchGridColumn() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridColumn.setId(longCount.incrementAndGet());

        // Create the GridColumn
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridColumn in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamGridColumn() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridColumn.setId(longCount.incrementAndGet());

        // Create the GridColumn
        GridColumnDTO gridColumnDTO = gridColumnMapper.toDto(gridColumn);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridColumnDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the GridColumn in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteGridColumn() {
        // Initialize the database
        insertedGridColumn = gridColumnRepository.save(gridColumn).block();

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the gridColumn
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, gridColumn.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return gridColumnRepository.count().block();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected GridColumn getPersistedGridColumn(GridColumn gridColumn) {
        return gridColumnRepository.findById(gridColumn.getId()).block();
    }

    protected void assertPersistedGridColumnToMatchAllProperties(GridColumn expectedGridColumn) {
        // Test fails because reactive api returns an empty object instead of null
        // assertGridColumnAllPropertiesEquals(expectedGridColumn, getPersistedGridColumn(expectedGridColumn));
        assertGridColumnUpdatableFieldsEquals(expectedGridColumn, getPersistedGridColumn(expectedGridColumn));
    }

    protected void assertPersistedGridColumnToMatchUpdatableProperties(GridColumn expectedGridColumn) {
        // Test fails because reactive api returns an empty object instead of null
        // assertGridColumnAllUpdatablePropertiesEquals(expectedGridColumn, getPersistedGridColumn(expectedGridColumn));
        assertGridColumnUpdatableFieldsEquals(expectedGridColumn, getPersistedGridColumn(expectedGridColumn));
    }
}
