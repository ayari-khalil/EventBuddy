package dev.flonixa.com.web.rest;

import dev.flonixa.com.repository.GridToolbarItemRepository;
import dev.flonixa.com.service.GridToolbarItemService;
import dev.flonixa.com.service.dto.GridToolbarItemDTO;
import dev.flonixa.com.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.ForwardedHeaderUtils;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link dev.flonixa.com.domain.GridToolbarItem}.
 */
@RestController
@RequestMapping("/api/grid-toolbar-items")
public class GridToolbarItemResource {

    private static final Logger LOG = LoggerFactory.getLogger(GridToolbarItemResource.class);

    private static final String ENTITY_NAME = "gmoduleGridToolbarItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GridToolbarItemService gridToolbarItemService;

    private final GridToolbarItemRepository gridToolbarItemRepository;

    public GridToolbarItemResource(GridToolbarItemService gridToolbarItemService, GridToolbarItemRepository gridToolbarItemRepository) {
        this.gridToolbarItemService = gridToolbarItemService;
        this.gridToolbarItemRepository = gridToolbarItemRepository;
    }

    /**
     * {@code POST  /grid-toolbar-items} : Create a new gridToolbarItem.
     *
     * @param gridToolbarItemDTO the gridToolbarItemDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gridToolbarItemDTO, or with status {@code 400 (Bad Request)} if the gridToolbarItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public Mono<ResponseEntity<GridToolbarItemDTO>> createGridToolbarItem(@RequestBody GridToolbarItemDTO gridToolbarItemDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save GridToolbarItem : {}", gridToolbarItemDTO);
        if (gridToolbarItemDTO.getId() != null) {
            throw new BadRequestAlertException("A new gridToolbarItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return gridToolbarItemService
            .save(gridToolbarItemDTO)
            .map(result -> {
                try {
                    return ResponseEntity.created(new URI("/api/grid-toolbar-items/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /grid-toolbar-items/:id} : Updates an existing gridToolbarItem.
     *
     * @param id the id of the gridToolbarItemDTO to save.
     * @param gridToolbarItemDTO the gridToolbarItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gridToolbarItemDTO,
     * or with status {@code 400 (Bad Request)} if the gridToolbarItemDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gridToolbarItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public Mono<ResponseEntity<GridToolbarItemDTO>> updateGridToolbarItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GridToolbarItemDTO gridToolbarItemDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update GridToolbarItem : {}, {}", id, gridToolbarItemDTO);
        if (gridToolbarItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gridToolbarItemDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return gridToolbarItemRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return gridToolbarItemService
                    .update(gridToolbarItemDTO)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /grid-toolbar-items/:id} : Partial updates given fields of an existing gridToolbarItem, field will ignore if it is null
     *
     * @param id the id of the gridToolbarItemDTO to save.
     * @param gridToolbarItemDTO the gridToolbarItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gridToolbarItemDTO,
     * or with status {@code 400 (Bad Request)} if the gridToolbarItemDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gridToolbarItemDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gridToolbarItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<GridToolbarItemDTO>> partialUpdateGridToolbarItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GridToolbarItemDTO gridToolbarItemDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update GridToolbarItem partially : {}, {}", id, gridToolbarItemDTO);
        if (gridToolbarItemDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gridToolbarItemDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return gridToolbarItemRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<GridToolbarItemDTO> result = gridToolbarItemService.partialUpdate(gridToolbarItemDTO);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /grid-toolbar-items} : get all the gridToolbarItems.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gridToolbarItems in body.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<GridToolbarItemDTO>>> getAllGridToolbarItems(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        ServerHttpRequest request,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of GridToolbarItems");
        return gridToolbarItemService
            .countAll()
            .zipWith(gridToolbarItemService.findAll(pageable).collectList())
            .map(countWithEntities ->
                ResponseEntity.ok()
                    .headers(
                        PaginationUtil.generatePaginationHttpHeaders(
                            ForwardedHeaderUtils.adaptFromForwardedHeaders(request.getURI(), request.getHeaders()),
                            new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                        )
                    )
                    .body(countWithEntities.getT2())
            );
    }

    /**
     * {@code GET  /grid-toolbar-items/:id} : get the "id" gridToolbarItem.
     *
     * @param id the id of the gridToolbarItemDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gridToolbarItemDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<GridToolbarItemDTO>> getGridToolbarItem(@PathVariable("id") Long id) {
        LOG.debug("REST request to get GridToolbarItem : {}", id);
        Mono<GridToolbarItemDTO> gridToolbarItemDTO = gridToolbarItemService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gridToolbarItemDTO);
    }

    /**
     * {@code DELETE  /grid-toolbar-items/:id} : delete the "id" gridToolbarItem.
     *
     * @param id the id of the gridToolbarItemDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteGridToolbarItem(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete GridToolbarItem : {}", id);
        return gridToolbarItemService
            .delete(id)
            .then(
                Mono.just(
                    ResponseEntity.noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                        .build()
                )
            );
    }
}
