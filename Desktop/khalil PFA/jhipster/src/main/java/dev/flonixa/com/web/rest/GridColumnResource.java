package dev.flonixa.com.web.rest;

import dev.flonixa.com.repository.GridColumnRepository;
import dev.flonixa.com.service.GridColumnService;
import dev.flonixa.com.service.dto.GridColumnDTO;
import dev.flonixa.com.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
 * REST controller for managing {@link dev.flonixa.com.domain.GridColumn}.
 */
@RestController
@RequestMapping("/api/grid-columns")
public class GridColumnResource {

    private static final Logger LOG = LoggerFactory.getLogger(GridColumnResource.class);

    private static final String ENTITY_NAME = "gmoduleGridColumn";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GridColumnService gridColumnService;

    private final GridColumnRepository gridColumnRepository;

    public GridColumnResource(GridColumnService gridColumnService, GridColumnRepository gridColumnRepository) {
        this.gridColumnService = gridColumnService;
        this.gridColumnRepository = gridColumnRepository;
    }

    /**
     * {@code POST  /grid-columns} : Create a new gridColumn.
     *
     * @param gridColumnDTO the gridColumnDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gridColumnDTO, or with status {@code 400 (Bad Request)} if the gridColumn has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public Mono<ResponseEntity<GridColumnDTO>> createGridColumn(@Valid @RequestBody GridColumnDTO gridColumnDTO) throws URISyntaxException {
        LOG.debug("REST request to save GridColumn : {}", gridColumnDTO);
        if (gridColumnDTO.getId() != null) {
            throw new BadRequestAlertException("A new gridColumn cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return gridColumnService
            .save(gridColumnDTO)
            .map(result -> {
                try {
                    return ResponseEntity.created(new URI("/api/grid-columns/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /grid-columns/:id} : Updates an existing gridColumn.
     *
     * @param id the id of the gridColumnDTO to save.
     * @param gridColumnDTO the gridColumnDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gridColumnDTO,
     * or with status {@code 400 (Bad Request)} if the gridColumnDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gridColumnDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public Mono<ResponseEntity<GridColumnDTO>> updateGridColumn(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GridColumnDTO gridColumnDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update GridColumn : {}, {}", id, gridColumnDTO);
        if (gridColumnDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gridColumnDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return gridColumnRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return gridColumnService
                    .update(gridColumnDTO)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /grid-columns/:id} : Partial updates given fields of an existing gridColumn, field will ignore if it is null
     *
     * @param id the id of the gridColumnDTO to save.
     * @param gridColumnDTO the gridColumnDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gridColumnDTO,
     * or with status {@code 400 (Bad Request)} if the gridColumnDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gridColumnDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gridColumnDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<GridColumnDTO>> partialUpdateGridColumn(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GridColumnDTO gridColumnDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update GridColumn partially : {}, {}", id, gridColumnDTO);
        if (gridColumnDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gridColumnDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return gridColumnRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<GridColumnDTO> result = gridColumnService.partialUpdate(gridColumnDTO);

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
     * {@code GET  /grid-columns} : get all the gridColumns.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gridColumns in body.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<GridColumnDTO>>> getAllGridColumns(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        ServerHttpRequest request,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of GridColumns");
        return gridColumnService
            .countAll()
            .zipWith(gridColumnService.findAll(pageable).collectList())
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
     * {@code GET  /grid-columns/:id} : get the "id" gridColumn.
     *
     * @param id the id of the gridColumnDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gridColumnDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<GridColumnDTO>> getGridColumn(@PathVariable("id") Long id) {
        LOG.debug("REST request to get GridColumn : {}", id);
        Mono<GridColumnDTO> gridColumnDTO = gridColumnService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gridColumnDTO);
    }

    /**
     * {@code DELETE  /grid-columns/:id} : delete the "id" gridColumn.
     *
     * @param id the id of the gridColumnDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteGridColumn(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete GridColumn : {}", id);
        return gridColumnService
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
