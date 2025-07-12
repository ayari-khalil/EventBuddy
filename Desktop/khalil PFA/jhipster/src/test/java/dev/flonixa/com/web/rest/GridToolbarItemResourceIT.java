package dev.flonixa.com.web.rest;

import static dev.flonixa.com.domain.GridToolbarItemAsserts.*;
import static dev.flonixa.com.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.flonixa.com.IntegrationTest;
import dev.flonixa.com.domain.GridToolbarItem;
import dev.flonixa.com.repository.EntityManager;
import dev.flonixa.com.repository.GridToolbarItemRepository;
import dev.flonixa.com.service.GridToolbarItemService;
import dev.flonixa.com.service.dto.GridToolbarItemDTO;
import dev.flonixa.com.service.mapper.GridToolbarItemMapper;
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
 * Integration tests for the {@link GridToolbarItemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class GridToolbarItemResourceIT {

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String DEFAULT_WIDGET = "AAAAAAAAAA";
    private static final String UPDATED_WIDGET = "BBBBBBBBBB";

    private static final String DEFAULT_ICON = "AAAAAAAAAA";
    private static final String UPDATED_ICON = "BBBBBBBBBB";

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_HINT = "AAAAAAAAAA";
    private static final String UPDATED_HINT = "BBBBBBBBBB";

    private static final String DEFAULT_ON_CLICK_ACTION = "AAAAAAAAAA";
    private static final String UPDATED_ON_CLICK_ACTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_VISIBLE = false;
    private static final Boolean UPDATED_VISIBLE = true;

    private static final String ENTITY_API_URL = "/api/grid-toolbar-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GridToolbarItemRepository gridToolbarItemRepository;

    @Mock
    private GridToolbarItemRepository gridToolbarItemRepositoryMock;

    @Autowired
    private GridToolbarItemMapper gridToolbarItemMapper;

    @Mock
    private GridToolbarItemService gridToolbarItemServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private GridToolbarItem gridToolbarItem;

    private GridToolbarItem insertedGridToolbarItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GridToolbarItem createEntity() {
        return new GridToolbarItem()
            .location(DEFAULT_LOCATION)
            .widget(DEFAULT_WIDGET)
            .icon(DEFAULT_ICON)
            .text(DEFAULT_TEXT)
            .hint(DEFAULT_HINT)
            .onClickAction(DEFAULT_ON_CLICK_ACTION)
            .visible(DEFAULT_VISIBLE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GridToolbarItem createUpdatedEntity() {
        return new GridToolbarItem()
            .location(UPDATED_LOCATION)
            .widget(UPDATED_WIDGET)
            .icon(UPDATED_ICON)
            .text(UPDATED_TEXT)
            .hint(UPDATED_HINT)
            .onClickAction(UPDATED_ON_CLICK_ACTION)
            .visible(UPDATED_VISIBLE);
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(GridToolbarItem.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @BeforeEach
    void initTest() {
        gridToolbarItem = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedGridToolbarItem != null) {
            gridToolbarItemRepository.delete(insertedGridToolbarItem).block();
            insertedGridToolbarItem = null;
        }
        deleteEntities(em);
    }

    @Test
    void createGridToolbarItem() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the GridToolbarItem
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(gridToolbarItem);
        var returnedGridToolbarItemDTO = webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isCreated()
            .expectBody(GridToolbarItemDTO.class)
            .returnResult()
            .getResponseBody();

        // Validate the GridToolbarItem in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedGridToolbarItem = gridToolbarItemMapper.toEntity(returnedGridToolbarItemDTO);
        assertGridToolbarItemUpdatableFieldsEquals(returnedGridToolbarItem, getPersistedGridToolbarItem(returnedGridToolbarItem));

        insertedGridToolbarItem = returnedGridToolbarItem;
    }

    @Test
    void createGridToolbarItemWithExistingId() throws Exception {
        // Create the GridToolbarItem with an existing ID
        gridToolbarItem.setId(1L);
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(gridToolbarItem);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridToolbarItem in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void getAllGridToolbarItems() {
        // Initialize the database
        insertedGridToolbarItem = gridToolbarItemRepository.save(gridToolbarItem).block();

        // Get all the gridToolbarItemList
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
            .value(hasItem(gridToolbarItem.getId().intValue()))
            .jsonPath("$.[*].location")
            .value(hasItem(DEFAULT_LOCATION))
            .jsonPath("$.[*].widget")
            .value(hasItem(DEFAULT_WIDGET))
            .jsonPath("$.[*].icon")
            .value(hasItem(DEFAULT_ICON))
            .jsonPath("$.[*].text")
            .value(hasItem(DEFAULT_TEXT))
            .jsonPath("$.[*].hint")
            .value(hasItem(DEFAULT_HINT))
            .jsonPath("$.[*].onClickAction")
            .value(hasItem(DEFAULT_ON_CLICK_ACTION))
            .jsonPath("$.[*].visible")
            .value(hasItem(DEFAULT_VISIBLE));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGridToolbarItemsWithEagerRelationshipsIsEnabled() {
        when(gridToolbarItemServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(gridToolbarItemServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGridToolbarItemsWithEagerRelationshipsIsNotEnabled() {
        when(gridToolbarItemServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(gridToolbarItemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getGridToolbarItem() {
        // Initialize the database
        insertedGridToolbarItem = gridToolbarItemRepository.save(gridToolbarItem).block();

        // Get the gridToolbarItem
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, gridToolbarItem.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(gridToolbarItem.getId().intValue()))
            .jsonPath("$.location")
            .value(is(DEFAULT_LOCATION))
            .jsonPath("$.widget")
            .value(is(DEFAULT_WIDGET))
            .jsonPath("$.icon")
            .value(is(DEFAULT_ICON))
            .jsonPath("$.text")
            .value(is(DEFAULT_TEXT))
            .jsonPath("$.hint")
            .value(is(DEFAULT_HINT))
            .jsonPath("$.onClickAction")
            .value(is(DEFAULT_ON_CLICK_ACTION))
            .jsonPath("$.visible")
            .value(is(DEFAULT_VISIBLE));
    }

    @Test
    void getNonExistingGridToolbarItem() {
        // Get the gridToolbarItem
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingGridToolbarItem() throws Exception {
        // Initialize the database
        insertedGridToolbarItem = gridToolbarItemRepository.save(gridToolbarItem).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridToolbarItem
        GridToolbarItem updatedGridToolbarItem = gridToolbarItemRepository.findById(gridToolbarItem.getId()).block();
        updatedGridToolbarItem
            .location(UPDATED_LOCATION)
            .widget(UPDATED_WIDGET)
            .icon(UPDATED_ICON)
            .text(UPDATED_TEXT)
            .hint(UPDATED_HINT)
            .onClickAction(UPDATED_ON_CLICK_ACTION)
            .visible(UPDATED_VISIBLE);
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(updatedGridToolbarItem);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, gridToolbarItemDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridToolbarItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGridToolbarItemToMatchAllProperties(updatedGridToolbarItem);
    }

    @Test
    void putNonExistingGridToolbarItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridToolbarItem.setId(longCount.incrementAndGet());

        // Create the GridToolbarItem
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(gridToolbarItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, gridToolbarItemDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridToolbarItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchGridToolbarItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridToolbarItem.setId(longCount.incrementAndGet());

        // Create the GridToolbarItem
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(gridToolbarItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridToolbarItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamGridToolbarItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridToolbarItem.setId(longCount.incrementAndGet());

        // Create the GridToolbarItem
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(gridToolbarItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the GridToolbarItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateGridToolbarItemWithPatch() throws Exception {
        // Initialize the database
        insertedGridToolbarItem = gridToolbarItemRepository.save(gridToolbarItem).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridToolbarItem using partial update
        GridToolbarItem partialUpdatedGridToolbarItem = new GridToolbarItem();
        partialUpdatedGridToolbarItem.setId(gridToolbarItem.getId());

        partialUpdatedGridToolbarItem
            .location(UPDATED_LOCATION)
            .widget(UPDATED_WIDGET)
            .text(UPDATED_TEXT)
            .hint(UPDATED_HINT)
            .onClickAction(UPDATED_ON_CLICK_ACTION)
            .visible(UPDATED_VISIBLE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedGridToolbarItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedGridToolbarItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridToolbarItem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGridToolbarItemUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedGridToolbarItem, gridToolbarItem),
            getPersistedGridToolbarItem(gridToolbarItem)
        );
    }

    @Test
    void fullUpdateGridToolbarItemWithPatch() throws Exception {
        // Initialize the database
        insertedGridToolbarItem = gridToolbarItemRepository.save(gridToolbarItem).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridToolbarItem using partial update
        GridToolbarItem partialUpdatedGridToolbarItem = new GridToolbarItem();
        partialUpdatedGridToolbarItem.setId(gridToolbarItem.getId());

        partialUpdatedGridToolbarItem
            .location(UPDATED_LOCATION)
            .widget(UPDATED_WIDGET)
            .icon(UPDATED_ICON)
            .text(UPDATED_TEXT)
            .hint(UPDATED_HINT)
            .onClickAction(UPDATED_ON_CLICK_ACTION)
            .visible(UPDATED_VISIBLE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedGridToolbarItem.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedGridToolbarItem))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridToolbarItem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGridToolbarItemUpdatableFieldsEquals(
            partialUpdatedGridToolbarItem,
            getPersistedGridToolbarItem(partialUpdatedGridToolbarItem)
        );
    }

    @Test
    void patchNonExistingGridToolbarItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridToolbarItem.setId(longCount.incrementAndGet());

        // Create the GridToolbarItem
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(gridToolbarItem);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, gridToolbarItemDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridToolbarItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchGridToolbarItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridToolbarItem.setId(longCount.incrementAndGet());

        // Create the GridToolbarItem
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(gridToolbarItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridToolbarItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamGridToolbarItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridToolbarItem.setId(longCount.incrementAndGet());

        // Create the GridToolbarItem
        GridToolbarItemDTO gridToolbarItemDTO = gridToolbarItemMapper.toDto(gridToolbarItem);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridToolbarItemDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the GridToolbarItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteGridToolbarItem() {
        // Initialize the database
        insertedGridToolbarItem = gridToolbarItemRepository.save(gridToolbarItem).block();

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the gridToolbarItem
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, gridToolbarItem.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return gridToolbarItemRepository.count().block();
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

    protected GridToolbarItem getPersistedGridToolbarItem(GridToolbarItem gridToolbarItem) {
        return gridToolbarItemRepository.findById(gridToolbarItem.getId()).block();
    }

    protected void assertPersistedGridToolbarItemToMatchAllProperties(GridToolbarItem expectedGridToolbarItem) {
        // Test fails because reactive api returns an empty object instead of null
        // assertGridToolbarItemAllPropertiesEquals(expectedGridToolbarItem, getPersistedGridToolbarItem(expectedGridToolbarItem));
        assertGridToolbarItemUpdatableFieldsEquals(expectedGridToolbarItem, getPersistedGridToolbarItem(expectedGridToolbarItem));
    }

    protected void assertPersistedGridToolbarItemToMatchUpdatableProperties(GridToolbarItem expectedGridToolbarItem) {
        // Test fails because reactive api returns an empty object instead of null
        // assertGridToolbarItemAllUpdatablePropertiesEquals(expectedGridToolbarItem, getPersistedGridToolbarItem(expectedGridToolbarItem));
        assertGridToolbarItemUpdatableFieldsEquals(expectedGridToolbarItem, getPersistedGridToolbarItem(expectedGridToolbarItem));
    }
}
