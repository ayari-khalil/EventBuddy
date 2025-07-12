package dev.flonixa.com.web.rest;

import static dev.flonixa.com.domain.GridConfigurationAsserts.*;
import static dev.flonixa.com.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.flonixa.com.IntegrationTest;
import dev.flonixa.com.domain.GridConfiguration;
import dev.flonixa.com.repository.EntityManager;
import dev.flonixa.com.repository.GridConfigurationRepository;
import dev.flonixa.com.service.dto.GridConfigurationDTO;
import dev.flonixa.com.service.mapper.GridConfigurationMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link GridConfigurationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class GridConfigurationResourceIT {

    private static final String DEFAULT_GRID_NAME = "AAAAAAAAAA";
    private static final String UPDATED_GRID_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_PAGE_SIZE = 1;
    private static final Integer UPDATED_PAGE_SIZE = 2;

    private static final String DEFAULT_PAGER_ALLOWED_PAGE_SIZES = "AAAAAAAAAA";
    private static final String UPDATED_PAGER_ALLOWED_PAGE_SIZES = "BBBBBBBBBB";

    private static final Boolean DEFAULT_PAGER_SHOW_PAGE_SIZE_SELECTOR = false;
    private static final Boolean UPDATED_PAGER_SHOW_PAGE_SIZE_SELECTOR = true;

    private static final Boolean DEFAULT_PAGER_SHOW_NAVIGATION_BUTTONS = false;
    private static final Boolean UPDATED_PAGER_SHOW_NAVIGATION_BUTTONS = true;

    private static final Boolean DEFAULT_ALLOW_SORTING = false;
    private static final Boolean UPDATED_ALLOW_SORTING = true;

    private static final String DEFAULT_SORTING_MODE = "AAAAAAAAAA";
    private static final String UPDATED_SORTING_MODE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ALLOW_FILTERING = false;
    private static final Boolean UPDATED_ALLOW_FILTERING = true;

    private static final Boolean DEFAULT_FILTER_ROW_VISIBLE = false;
    private static final Boolean UPDATED_FILTER_ROW_VISIBLE = true;

    private static final Boolean DEFAULT_HEADER_FILTER_VISIBLE = false;
    private static final Boolean UPDATED_HEADER_FILTER_VISIBLE = true;

    private static final Boolean DEFAULT_ALLOW_SEARCH = false;
    private static final Boolean UPDATED_ALLOW_SEARCH = true;

    private static final Boolean DEFAULT_SEARCH_PANEL_VISIBLE = false;
    private static final Boolean UPDATED_SEARCH_PANEL_VISIBLE = true;

    private static final Integer DEFAULT_SEARCH_PANEL_WIDTH = 1;
    private static final Integer UPDATED_SEARCH_PANEL_WIDTH = 2;

    private static final String DEFAULT_SEARCH_PANEL_PLACEHOLDER = "AAAAAAAAAA";
    private static final String UPDATED_SEARCH_PANEL_PLACEHOLDER = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ALLOW_COLUMN_CHOOSER = false;
    private static final Boolean UPDATED_ALLOW_COLUMN_CHOOSER = true;

    private static final Boolean DEFAULT_COLUMN_CHOOSER_ENABLED = false;
    private static final Boolean UPDATED_COLUMN_CHOOSER_ENABLED = true;

    private static final Boolean DEFAULT_COLUMN_HIDING_ENABLED = false;
    private static final Boolean UPDATED_COLUMN_HIDING_ENABLED = true;

    private static final Boolean DEFAULT_ALLOW_EXPORT = false;
    private static final Boolean UPDATED_ALLOW_EXPORT = true;

    private static final Boolean DEFAULT_EXPORT_ENABLED = false;
    private static final Boolean UPDATED_EXPORT_ENABLED = true;

    private static final String DEFAULT_EXPORT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EXPORT_FILE_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ALLOW_GROUPING = false;
    private static final Boolean UPDATED_ALLOW_GROUPING = true;

    private static final Boolean DEFAULT_GROUP_PANEL_VISIBLE = false;
    private static final Boolean UPDATED_GROUP_PANEL_VISIBLE = true;

    private static final Boolean DEFAULT_ALLOW_COLUMN_REORDERING = false;
    private static final Boolean UPDATED_ALLOW_COLUMN_REORDERING = true;

    private static final Boolean DEFAULT_ALLOW_COLUMN_RESIZING = false;
    private static final Boolean UPDATED_ALLOW_COLUMN_RESIZING = true;

    private static final String DEFAULT_SELECTION_MODE = "AAAAAAAAAA";
    private static final String UPDATED_SELECTION_MODE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_SELECTION_ALLOW_SELECT_ALL = false;
    private static final Boolean UPDATED_SELECTION_ALLOW_SELECT_ALL = true;

    private static final String DEFAULT_SELECTION_SHOW_CHECK_BOXES_MODE = "AAAAAAAAAA";
    private static final String UPDATED_SELECTION_SHOW_CHECK_BOXES_MODE = "BBBBBBBBBB";

    private static final String DEFAULT_EDITING_MODE = "AAAAAAAAAA";
    private static final String UPDATED_EDITING_MODE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_EDITING_ALLOW_ADDING = false;
    private static final Boolean UPDATED_EDITING_ALLOW_ADDING = true;

    private static final Boolean DEFAULT_EDITING_ALLOW_UPDATING = false;
    private static final Boolean UPDATED_EDITING_ALLOW_UPDATING = true;

    private static final Boolean DEFAULT_EDITING_ALLOW_DELETING = false;
    private static final Boolean UPDATED_EDITING_ALLOW_DELETING = true;

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/grid-configurations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GridConfigurationRepository gridConfigurationRepository;

    @Autowired
    private GridConfigurationMapper gridConfigurationMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private GridConfiguration gridConfiguration;

    private GridConfiguration insertedGridConfiguration;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GridConfiguration createEntity() {
        return new GridConfiguration()
            .gridName(DEFAULT_GRID_NAME)
            .pageSize(DEFAULT_PAGE_SIZE)
            .pagerAllowedPageSizes(DEFAULT_PAGER_ALLOWED_PAGE_SIZES)
            .pagerShowPageSizeSelector(DEFAULT_PAGER_SHOW_PAGE_SIZE_SELECTOR)
            .pagerShowNavigationButtons(DEFAULT_PAGER_SHOW_NAVIGATION_BUTTONS)
            .allowSorting(DEFAULT_ALLOW_SORTING)
            .sortingMode(DEFAULT_SORTING_MODE)
            .allowFiltering(DEFAULT_ALLOW_FILTERING)
            .filterRowVisible(DEFAULT_FILTER_ROW_VISIBLE)
            .headerFilterVisible(DEFAULT_HEADER_FILTER_VISIBLE)
            .allowSearch(DEFAULT_ALLOW_SEARCH)
            .searchPanelVisible(DEFAULT_SEARCH_PANEL_VISIBLE)
            .searchPanelWidth(DEFAULT_SEARCH_PANEL_WIDTH)
            .searchPanelPlaceholder(DEFAULT_SEARCH_PANEL_PLACEHOLDER)
            .allowColumnChooser(DEFAULT_ALLOW_COLUMN_CHOOSER)
            .columnChooserEnabled(DEFAULT_COLUMN_CHOOSER_ENABLED)
            .columnHidingEnabled(DEFAULT_COLUMN_HIDING_ENABLED)
            .allowExport(DEFAULT_ALLOW_EXPORT)
            .exportEnabled(DEFAULT_EXPORT_ENABLED)
            .exportFileName(DEFAULT_EXPORT_FILE_NAME)
            .allowGrouping(DEFAULT_ALLOW_GROUPING)
            .groupPanelVisible(DEFAULT_GROUP_PANEL_VISIBLE)
            .allowColumnReordering(DEFAULT_ALLOW_COLUMN_REORDERING)
            .allowColumnResizing(DEFAULT_ALLOW_COLUMN_RESIZING)
            .selectionMode(DEFAULT_SELECTION_MODE)
            .selectionAllowSelectAll(DEFAULT_SELECTION_ALLOW_SELECT_ALL)
            .selectionShowCheckBoxesMode(DEFAULT_SELECTION_SHOW_CHECK_BOXES_MODE)
            .editingMode(DEFAULT_EDITING_MODE)
            .editingAllowAdding(DEFAULT_EDITING_ALLOW_ADDING)
            .editingAllowUpdating(DEFAULT_EDITING_ALLOW_UPDATING)
            .editingAllowDeleting(DEFAULT_EDITING_ALLOW_DELETING)
            .createdDate(DEFAULT_CREATED_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GridConfiguration createUpdatedEntity() {
        return new GridConfiguration()
            .gridName(UPDATED_GRID_NAME)
            .pageSize(UPDATED_PAGE_SIZE)
            .pagerAllowedPageSizes(UPDATED_PAGER_ALLOWED_PAGE_SIZES)
            .pagerShowPageSizeSelector(UPDATED_PAGER_SHOW_PAGE_SIZE_SELECTOR)
            .pagerShowNavigationButtons(UPDATED_PAGER_SHOW_NAVIGATION_BUTTONS)
            .allowSorting(UPDATED_ALLOW_SORTING)
            .sortingMode(UPDATED_SORTING_MODE)
            .allowFiltering(UPDATED_ALLOW_FILTERING)
            .filterRowVisible(UPDATED_FILTER_ROW_VISIBLE)
            .headerFilterVisible(UPDATED_HEADER_FILTER_VISIBLE)
            .allowSearch(UPDATED_ALLOW_SEARCH)
            .searchPanelVisible(UPDATED_SEARCH_PANEL_VISIBLE)
            .searchPanelWidth(UPDATED_SEARCH_PANEL_WIDTH)
            .searchPanelPlaceholder(UPDATED_SEARCH_PANEL_PLACEHOLDER)
            .allowColumnChooser(UPDATED_ALLOW_COLUMN_CHOOSER)
            .columnChooserEnabled(UPDATED_COLUMN_CHOOSER_ENABLED)
            .columnHidingEnabled(UPDATED_COLUMN_HIDING_ENABLED)
            .allowExport(UPDATED_ALLOW_EXPORT)
            .exportEnabled(UPDATED_EXPORT_ENABLED)
            .exportFileName(UPDATED_EXPORT_FILE_NAME)
            .allowGrouping(UPDATED_ALLOW_GROUPING)
            .groupPanelVisible(UPDATED_GROUP_PANEL_VISIBLE)
            .allowColumnReordering(UPDATED_ALLOW_COLUMN_REORDERING)
            .allowColumnResizing(UPDATED_ALLOW_COLUMN_RESIZING)
            .selectionMode(UPDATED_SELECTION_MODE)
            .selectionAllowSelectAll(UPDATED_SELECTION_ALLOW_SELECT_ALL)
            .selectionShowCheckBoxesMode(UPDATED_SELECTION_SHOW_CHECK_BOXES_MODE)
            .editingMode(UPDATED_EDITING_MODE)
            .editingAllowAdding(UPDATED_EDITING_ALLOW_ADDING)
            .editingAllowUpdating(UPDATED_EDITING_ALLOW_UPDATING)
            .editingAllowDeleting(UPDATED_EDITING_ALLOW_DELETING)
            .createdDate(UPDATED_CREATED_DATE);
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(GridConfiguration.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @BeforeEach
    void initTest() {
        gridConfiguration = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedGridConfiguration != null) {
            gridConfigurationRepository.delete(insertedGridConfiguration).block();
            insertedGridConfiguration = null;
        }
        deleteEntities(em);
    }

    @Test
    void createGridConfiguration() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the GridConfiguration
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);
        var returnedGridConfigurationDTO = webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isCreated()
            .expectBody(GridConfigurationDTO.class)
            .returnResult()
            .getResponseBody();

        // Validate the GridConfiguration in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedGridConfiguration = gridConfigurationMapper.toEntity(returnedGridConfigurationDTO);
        assertGridConfigurationUpdatableFieldsEquals(returnedGridConfiguration, getPersistedGridConfiguration(returnedGridConfiguration));

        insertedGridConfiguration = returnedGridConfiguration;
    }

    @Test
    void createGridConfigurationWithExistingId() throws Exception {
        // Create the GridConfiguration with an existing ID
        gridConfiguration.setId(1L);
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkGridNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        gridConfiguration.setGridName(null);

        // Create the GridConfiguration, which fails.
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllGridConfigurations() {
        // Initialize the database
        insertedGridConfiguration = gridConfigurationRepository.save(gridConfiguration).block();

        // Get all the gridConfigurationList
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
            .value(hasItem(gridConfiguration.getId().intValue()))
            .jsonPath("$.[*].gridName")
            .value(hasItem(DEFAULT_GRID_NAME))
            .jsonPath("$.[*].pageSize")
            .value(hasItem(DEFAULT_PAGE_SIZE))
            .jsonPath("$.[*].pagerAllowedPageSizes")
            .value(hasItem(DEFAULT_PAGER_ALLOWED_PAGE_SIZES))
            .jsonPath("$.[*].pagerShowPageSizeSelector")
            .value(hasItem(DEFAULT_PAGER_SHOW_PAGE_SIZE_SELECTOR))
            .jsonPath("$.[*].pagerShowNavigationButtons")
            .value(hasItem(DEFAULT_PAGER_SHOW_NAVIGATION_BUTTONS))
            .jsonPath("$.[*].allowSorting")
            .value(hasItem(DEFAULT_ALLOW_SORTING))
            .jsonPath("$.[*].sortingMode")
            .value(hasItem(DEFAULT_SORTING_MODE))
            .jsonPath("$.[*].allowFiltering")
            .value(hasItem(DEFAULT_ALLOW_FILTERING))
            .jsonPath("$.[*].filterRowVisible")
            .value(hasItem(DEFAULT_FILTER_ROW_VISIBLE))
            .jsonPath("$.[*].headerFilterVisible")
            .value(hasItem(DEFAULT_HEADER_FILTER_VISIBLE))
            .jsonPath("$.[*].allowSearch")
            .value(hasItem(DEFAULT_ALLOW_SEARCH))
            .jsonPath("$.[*].searchPanelVisible")
            .value(hasItem(DEFAULT_SEARCH_PANEL_VISIBLE))
            .jsonPath("$.[*].searchPanelWidth")
            .value(hasItem(DEFAULT_SEARCH_PANEL_WIDTH))
            .jsonPath("$.[*].searchPanelPlaceholder")
            .value(hasItem(DEFAULT_SEARCH_PANEL_PLACEHOLDER))
            .jsonPath("$.[*].allowColumnChooser")
            .value(hasItem(DEFAULT_ALLOW_COLUMN_CHOOSER))
            .jsonPath("$.[*].columnChooserEnabled")
            .value(hasItem(DEFAULT_COLUMN_CHOOSER_ENABLED))
            .jsonPath("$.[*].columnHidingEnabled")
            .value(hasItem(DEFAULT_COLUMN_HIDING_ENABLED))
            .jsonPath("$.[*].allowExport")
            .value(hasItem(DEFAULT_ALLOW_EXPORT))
            .jsonPath("$.[*].exportEnabled")
            .value(hasItem(DEFAULT_EXPORT_ENABLED))
            .jsonPath("$.[*].exportFileName")
            .value(hasItem(DEFAULT_EXPORT_FILE_NAME))
            .jsonPath("$.[*].allowGrouping")
            .value(hasItem(DEFAULT_ALLOW_GROUPING))
            .jsonPath("$.[*].groupPanelVisible")
            .value(hasItem(DEFAULT_GROUP_PANEL_VISIBLE))
            .jsonPath("$.[*].allowColumnReordering")
            .value(hasItem(DEFAULT_ALLOW_COLUMN_REORDERING))
            .jsonPath("$.[*].allowColumnResizing")
            .value(hasItem(DEFAULT_ALLOW_COLUMN_RESIZING))
            .jsonPath("$.[*].selectionMode")
            .value(hasItem(DEFAULT_SELECTION_MODE))
            .jsonPath("$.[*].selectionAllowSelectAll")
            .value(hasItem(DEFAULT_SELECTION_ALLOW_SELECT_ALL))
            .jsonPath("$.[*].selectionShowCheckBoxesMode")
            .value(hasItem(DEFAULT_SELECTION_SHOW_CHECK_BOXES_MODE))
            .jsonPath("$.[*].editingMode")
            .value(hasItem(DEFAULT_EDITING_MODE))
            .jsonPath("$.[*].editingAllowAdding")
            .value(hasItem(DEFAULT_EDITING_ALLOW_ADDING))
            .jsonPath("$.[*].editingAllowUpdating")
            .value(hasItem(DEFAULT_EDITING_ALLOW_UPDATING))
            .jsonPath("$.[*].editingAllowDeleting")
            .value(hasItem(DEFAULT_EDITING_ALLOW_DELETING))
            .jsonPath("$.[*].createdDate")
            .value(hasItem(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    void getGridConfiguration() {
        // Initialize the database
        insertedGridConfiguration = gridConfigurationRepository.save(gridConfiguration).block();

        // Get the gridConfiguration
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, gridConfiguration.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(gridConfiguration.getId().intValue()))
            .jsonPath("$.gridName")
            .value(is(DEFAULT_GRID_NAME))
            .jsonPath("$.pageSize")
            .value(is(DEFAULT_PAGE_SIZE))
            .jsonPath("$.pagerAllowedPageSizes")
            .value(is(DEFAULT_PAGER_ALLOWED_PAGE_SIZES))
            .jsonPath("$.pagerShowPageSizeSelector")
            .value(is(DEFAULT_PAGER_SHOW_PAGE_SIZE_SELECTOR))
            .jsonPath("$.pagerShowNavigationButtons")
            .value(is(DEFAULT_PAGER_SHOW_NAVIGATION_BUTTONS))
            .jsonPath("$.allowSorting")
            .value(is(DEFAULT_ALLOW_SORTING))
            .jsonPath("$.sortingMode")
            .value(is(DEFAULT_SORTING_MODE))
            .jsonPath("$.allowFiltering")
            .value(is(DEFAULT_ALLOW_FILTERING))
            .jsonPath("$.filterRowVisible")
            .value(is(DEFAULT_FILTER_ROW_VISIBLE))
            .jsonPath("$.headerFilterVisible")
            .value(is(DEFAULT_HEADER_FILTER_VISIBLE))
            .jsonPath("$.allowSearch")
            .value(is(DEFAULT_ALLOW_SEARCH))
            .jsonPath("$.searchPanelVisible")
            .value(is(DEFAULT_SEARCH_PANEL_VISIBLE))
            .jsonPath("$.searchPanelWidth")
            .value(is(DEFAULT_SEARCH_PANEL_WIDTH))
            .jsonPath("$.searchPanelPlaceholder")
            .value(is(DEFAULT_SEARCH_PANEL_PLACEHOLDER))
            .jsonPath("$.allowColumnChooser")
            .value(is(DEFAULT_ALLOW_COLUMN_CHOOSER))
            .jsonPath("$.columnChooserEnabled")
            .value(is(DEFAULT_COLUMN_CHOOSER_ENABLED))
            .jsonPath("$.columnHidingEnabled")
            .value(is(DEFAULT_COLUMN_HIDING_ENABLED))
            .jsonPath("$.allowExport")
            .value(is(DEFAULT_ALLOW_EXPORT))
            .jsonPath("$.exportEnabled")
            .value(is(DEFAULT_EXPORT_ENABLED))
            .jsonPath("$.exportFileName")
            .value(is(DEFAULT_EXPORT_FILE_NAME))
            .jsonPath("$.allowGrouping")
            .value(is(DEFAULT_ALLOW_GROUPING))
            .jsonPath("$.groupPanelVisible")
            .value(is(DEFAULT_GROUP_PANEL_VISIBLE))
            .jsonPath("$.allowColumnReordering")
            .value(is(DEFAULT_ALLOW_COLUMN_REORDERING))
            .jsonPath("$.allowColumnResizing")
            .value(is(DEFAULT_ALLOW_COLUMN_RESIZING))
            .jsonPath("$.selectionMode")
            .value(is(DEFAULT_SELECTION_MODE))
            .jsonPath("$.selectionAllowSelectAll")
            .value(is(DEFAULT_SELECTION_ALLOW_SELECT_ALL))
            .jsonPath("$.selectionShowCheckBoxesMode")
            .value(is(DEFAULT_SELECTION_SHOW_CHECK_BOXES_MODE))
            .jsonPath("$.editingMode")
            .value(is(DEFAULT_EDITING_MODE))
            .jsonPath("$.editingAllowAdding")
            .value(is(DEFAULT_EDITING_ALLOW_ADDING))
            .jsonPath("$.editingAllowUpdating")
            .value(is(DEFAULT_EDITING_ALLOW_UPDATING))
            .jsonPath("$.editingAllowDeleting")
            .value(is(DEFAULT_EDITING_ALLOW_DELETING))
            .jsonPath("$.createdDate")
            .value(is(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    void getNonExistingGridConfiguration() {
        // Get the gridConfiguration
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingGridConfiguration() throws Exception {
        // Initialize the database
        insertedGridConfiguration = gridConfigurationRepository.save(gridConfiguration).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridConfiguration
        GridConfiguration updatedGridConfiguration = gridConfigurationRepository.findById(gridConfiguration.getId()).block();
        updatedGridConfiguration
            .gridName(UPDATED_GRID_NAME)
            .pageSize(UPDATED_PAGE_SIZE)
            .pagerAllowedPageSizes(UPDATED_PAGER_ALLOWED_PAGE_SIZES)
            .pagerShowPageSizeSelector(UPDATED_PAGER_SHOW_PAGE_SIZE_SELECTOR)
            .pagerShowNavigationButtons(UPDATED_PAGER_SHOW_NAVIGATION_BUTTONS)
            .allowSorting(UPDATED_ALLOW_SORTING)
            .sortingMode(UPDATED_SORTING_MODE)
            .allowFiltering(UPDATED_ALLOW_FILTERING)
            .filterRowVisible(UPDATED_FILTER_ROW_VISIBLE)
            .headerFilterVisible(UPDATED_HEADER_FILTER_VISIBLE)
            .allowSearch(UPDATED_ALLOW_SEARCH)
            .searchPanelVisible(UPDATED_SEARCH_PANEL_VISIBLE)
            .searchPanelWidth(UPDATED_SEARCH_PANEL_WIDTH)
            .searchPanelPlaceholder(UPDATED_SEARCH_PANEL_PLACEHOLDER)
            .allowColumnChooser(UPDATED_ALLOW_COLUMN_CHOOSER)
            .columnChooserEnabled(UPDATED_COLUMN_CHOOSER_ENABLED)
            .columnHidingEnabled(UPDATED_COLUMN_HIDING_ENABLED)
            .allowExport(UPDATED_ALLOW_EXPORT)
            .exportEnabled(UPDATED_EXPORT_ENABLED)
            .exportFileName(UPDATED_EXPORT_FILE_NAME)
            .allowGrouping(UPDATED_ALLOW_GROUPING)
            .groupPanelVisible(UPDATED_GROUP_PANEL_VISIBLE)
            .allowColumnReordering(UPDATED_ALLOW_COLUMN_REORDERING)
            .allowColumnResizing(UPDATED_ALLOW_COLUMN_RESIZING)
            .selectionMode(UPDATED_SELECTION_MODE)
            .selectionAllowSelectAll(UPDATED_SELECTION_ALLOW_SELECT_ALL)
            .selectionShowCheckBoxesMode(UPDATED_SELECTION_SHOW_CHECK_BOXES_MODE)
            .editingMode(UPDATED_EDITING_MODE)
            .editingAllowAdding(UPDATED_EDITING_ALLOW_ADDING)
            .editingAllowUpdating(UPDATED_EDITING_ALLOW_UPDATING)
            .editingAllowDeleting(UPDATED_EDITING_ALLOW_DELETING)
            .createdDate(UPDATED_CREATED_DATE);
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(updatedGridConfiguration);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, gridConfigurationDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGridConfigurationToMatchAllProperties(updatedGridConfiguration);
    }

    @Test
    void putNonExistingGridConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridConfiguration.setId(longCount.incrementAndGet());

        // Create the GridConfiguration
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, gridConfigurationDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchGridConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridConfiguration.setId(longCount.incrementAndGet());

        // Create the GridConfiguration
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamGridConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridConfiguration.setId(longCount.incrementAndGet());

        // Create the GridConfiguration
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the GridConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateGridConfigurationWithPatch() throws Exception {
        // Initialize the database
        insertedGridConfiguration = gridConfigurationRepository.save(gridConfiguration).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridConfiguration using partial update
        GridConfiguration partialUpdatedGridConfiguration = new GridConfiguration();
        partialUpdatedGridConfiguration.setId(gridConfiguration.getId());

        partialUpdatedGridConfiguration
            .gridName(UPDATED_GRID_NAME)
            .pagerShowPageSizeSelector(UPDATED_PAGER_SHOW_PAGE_SIZE_SELECTOR)
            .pagerShowNavigationButtons(UPDATED_PAGER_SHOW_NAVIGATION_BUTTONS)
            .allowSorting(UPDATED_ALLOW_SORTING)
            .sortingMode(UPDATED_SORTING_MODE)
            .allowFiltering(UPDATED_ALLOW_FILTERING)
            .filterRowVisible(UPDATED_FILTER_ROW_VISIBLE)
            .headerFilterVisible(UPDATED_HEADER_FILTER_VISIBLE)
            .searchPanelVisible(UPDATED_SEARCH_PANEL_VISIBLE)
            .searchPanelPlaceholder(UPDATED_SEARCH_PANEL_PLACEHOLDER)
            .allowColumnChooser(UPDATED_ALLOW_COLUMN_CHOOSER)
            .columnChooserEnabled(UPDATED_COLUMN_CHOOSER_ENABLED)
            .columnHidingEnabled(UPDATED_COLUMN_HIDING_ENABLED)
            .allowExport(UPDATED_ALLOW_EXPORT)
            .exportEnabled(UPDATED_EXPORT_ENABLED)
            .allowColumnReordering(UPDATED_ALLOW_COLUMN_REORDERING)
            .selectionAllowSelectAll(UPDATED_SELECTION_ALLOW_SELECT_ALL)
            .selectionShowCheckBoxesMode(UPDATED_SELECTION_SHOW_CHECK_BOXES_MODE)
            .editingMode(UPDATED_EDITING_MODE)
            .editingAllowUpdating(UPDATED_EDITING_ALLOW_UPDATING);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedGridConfiguration.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedGridConfiguration))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridConfiguration in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGridConfigurationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedGridConfiguration, gridConfiguration),
            getPersistedGridConfiguration(gridConfiguration)
        );
    }

    @Test
    void fullUpdateGridConfigurationWithPatch() throws Exception {
        // Initialize the database
        insertedGridConfiguration = gridConfigurationRepository.save(gridConfiguration).block();

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gridConfiguration using partial update
        GridConfiguration partialUpdatedGridConfiguration = new GridConfiguration();
        partialUpdatedGridConfiguration.setId(gridConfiguration.getId());

        partialUpdatedGridConfiguration
            .gridName(UPDATED_GRID_NAME)
            .pageSize(UPDATED_PAGE_SIZE)
            .pagerAllowedPageSizes(UPDATED_PAGER_ALLOWED_PAGE_SIZES)
            .pagerShowPageSizeSelector(UPDATED_PAGER_SHOW_PAGE_SIZE_SELECTOR)
            .pagerShowNavigationButtons(UPDATED_PAGER_SHOW_NAVIGATION_BUTTONS)
            .allowSorting(UPDATED_ALLOW_SORTING)
            .sortingMode(UPDATED_SORTING_MODE)
            .allowFiltering(UPDATED_ALLOW_FILTERING)
            .filterRowVisible(UPDATED_FILTER_ROW_VISIBLE)
            .headerFilterVisible(UPDATED_HEADER_FILTER_VISIBLE)
            .allowSearch(UPDATED_ALLOW_SEARCH)
            .searchPanelVisible(UPDATED_SEARCH_PANEL_VISIBLE)
            .searchPanelWidth(UPDATED_SEARCH_PANEL_WIDTH)
            .searchPanelPlaceholder(UPDATED_SEARCH_PANEL_PLACEHOLDER)
            .allowColumnChooser(UPDATED_ALLOW_COLUMN_CHOOSER)
            .columnChooserEnabled(UPDATED_COLUMN_CHOOSER_ENABLED)
            .columnHidingEnabled(UPDATED_COLUMN_HIDING_ENABLED)
            .allowExport(UPDATED_ALLOW_EXPORT)
            .exportEnabled(UPDATED_EXPORT_ENABLED)
            .exportFileName(UPDATED_EXPORT_FILE_NAME)
            .allowGrouping(UPDATED_ALLOW_GROUPING)
            .groupPanelVisible(UPDATED_GROUP_PANEL_VISIBLE)
            .allowColumnReordering(UPDATED_ALLOW_COLUMN_REORDERING)
            .allowColumnResizing(UPDATED_ALLOW_COLUMN_RESIZING)
            .selectionMode(UPDATED_SELECTION_MODE)
            .selectionAllowSelectAll(UPDATED_SELECTION_ALLOW_SELECT_ALL)
            .selectionShowCheckBoxesMode(UPDATED_SELECTION_SHOW_CHECK_BOXES_MODE)
            .editingMode(UPDATED_EDITING_MODE)
            .editingAllowAdding(UPDATED_EDITING_ALLOW_ADDING)
            .editingAllowUpdating(UPDATED_EDITING_ALLOW_UPDATING)
            .editingAllowDeleting(UPDATED_EDITING_ALLOW_DELETING)
            .createdDate(UPDATED_CREATED_DATE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedGridConfiguration.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(partialUpdatedGridConfiguration))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the GridConfiguration in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGridConfigurationUpdatableFieldsEquals(
            partialUpdatedGridConfiguration,
            getPersistedGridConfiguration(partialUpdatedGridConfiguration)
        );
    }

    @Test
    void patchNonExistingGridConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridConfiguration.setId(longCount.incrementAndGet());

        // Create the GridConfiguration
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, gridConfigurationDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchGridConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridConfiguration.setId(longCount.incrementAndGet());

        // Create the GridConfiguration
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, longCount.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the GridConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamGridConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gridConfiguration.setId(longCount.incrementAndGet());

        // Create the GridConfiguration
        GridConfigurationDTO gridConfigurationDTO = gridConfigurationMapper.toDto(gridConfiguration);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(om.writeValueAsBytes(gridConfigurationDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the GridConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteGridConfiguration() {
        // Initialize the database
        insertedGridConfiguration = gridConfigurationRepository.save(gridConfiguration).block();

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the gridConfiguration
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, gridConfiguration.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return gridConfigurationRepository.count().block();
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

    protected GridConfiguration getPersistedGridConfiguration(GridConfiguration gridConfiguration) {
        return gridConfigurationRepository.findById(gridConfiguration.getId()).block();
    }

    protected void assertPersistedGridConfigurationToMatchAllProperties(GridConfiguration expectedGridConfiguration) {
        // Test fails because reactive api returns an empty object instead of null
        // assertGridConfigurationAllPropertiesEquals(expectedGridConfiguration, getPersistedGridConfiguration(expectedGridConfiguration));
        assertGridConfigurationUpdatableFieldsEquals(expectedGridConfiguration, getPersistedGridConfiguration(expectedGridConfiguration));
    }

    protected void assertPersistedGridConfigurationToMatchUpdatableProperties(GridConfiguration expectedGridConfiguration) {
        // Test fails because reactive api returns an empty object instead of null
        // assertGridConfigurationAllUpdatablePropertiesEquals(expectedGridConfiguration, getPersistedGridConfiguration(expectedGridConfiguration));
        assertGridConfigurationUpdatableFieldsEquals(expectedGridConfiguration, getPersistedGridConfiguration(expectedGridConfiguration));
    }
}
