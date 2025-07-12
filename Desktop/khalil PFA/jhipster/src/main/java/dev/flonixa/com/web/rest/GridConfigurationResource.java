package dev.flonixa.com.web.rest;

import dev.flonixa.com.repository.GridConfigurationRepository;
import dev.flonixa.com.service.GridConfigurationService;
import dev.flonixa.com.service.dto.GridConfigurationDTO;
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
 * REST controller for managing {@link dev.flonixa.com.domain.GridConfiguration}.
 */
@RestController
@RequestMapping("/api/grid-configurations")
public class GridConfigurationResource {

    private static final Logger LOG = LoggerFactory.getLogger(GridConfigurationResource.class);

    private static final String ENTITY_NAME = "gmoduleGridConfiguration";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GridConfigurationService gridConfigurationService;

    private final GridConfigurationRepository gridConfigurationRepository;

    public GridConfigurationResource(
        GridConfigurationService gridConfigurationService,
        GridConfigurationRepository gridConfigurationRepository
    ) {
        this.gridConfigurationService = gridConfigurationService;
        this.gridConfigurationRepository = gridConfigurationRepository;
    }

    /**
     * {@code POST  /grid-configurations} : Create a new gridConfiguration.
     *
     * @param gridConfigurationDTO the gridConfigurationDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gridConfigurationDTO, or with status {@code 400 (Bad Request)} if the gridConfiguration has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public Mono<ResponseEntity<GridConfigurationDTO>> createGridConfiguration(
        @Valid @RequestBody GridConfigurationDTO gridConfigurationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to save GridConfiguration : {}", gridConfigurationDTO);
        if (gridConfigurationDTO.getId() != null) {
            throw new BadRequestAlertException("A new gridConfiguration cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return gridConfigurationService
            .save(gridConfigurationDTO)
            .map(result -> {
                try {
                    return ResponseEntity.created(new URI("/api/grid-configurations/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /grid-configurations/:id} : Updates an existing gridConfiguration.
     *
     * @param id the id of the gridConfigurationDTO to save.
     * @param gridConfigurationDTO the gridConfigurationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gridConfigurationDTO,
     * or with status {@code 400 (Bad Request)} if the gridConfigurationDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gridConfigurationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public Mono<ResponseEntity<GridConfigurationDTO>> updateGridConfiguration(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GridConfigurationDTO gridConfigurationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update GridConfiguration : {}, {}", id, gridConfigurationDTO);
        if (gridConfigurationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gridConfigurationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return gridConfigurationRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return gridConfigurationService
                    .update(gridConfigurationDTO)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /grid-configurations/:id} : Partial updates given fields of an existing gridConfiguration, field will ignore if it is null
     *
     * @param id the id of the gridConfigurationDTO to save.
     * @param gridConfigurationDTO the gridConfigurationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gridConfigurationDTO,
     * or with status {@code 400 (Bad Request)} if the gridConfigurationDTO is not valid,
     * or with status {@code 404 (Not Found)} if the gridConfigurationDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the gridConfigurationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<GridConfigurationDTO>> partialUpdateGridConfiguration(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GridConfigurationDTO gridConfigurationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update GridConfiguration partially : {}, {}", id, gridConfigurationDTO);
        if (gridConfigurationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gridConfigurationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return gridConfigurationRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<GridConfigurationDTO> result = gridConfigurationService.partialUpdate(gridConfigurationDTO);

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
     * {@code GET  /grid-configurations} : get all the gridConfigurations.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gridConfigurations in body.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<GridConfigurationDTO>>> getAllGridConfigurations(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        ServerHttpRequest request
    ) {
        LOG.debug("REST request to get a page of GridConfigurations");
        return gridConfigurationService
            .countAll()
            .zipWith(gridConfigurationService.findAll(pageable).collectList())
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
     * {@code GET  /grid-configurations/:id} : get the "id" gridConfiguration.
     *
     * @param id the id of the gridConfigurationDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gridConfigurationDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<GridConfigurationDTO>> getGridConfiguration(@PathVariable("id") Long id) {
        LOG.debug("REST request to get GridConfiguration : {}", id);
        Mono<GridConfigurationDTO> gridConfigurationDTO = gridConfigurationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gridConfigurationDTO);
    }

    /**
     * {@code DELETE  /grid-configurations/:id} : delete the "id" gridConfiguration.
     *
     * @param id the id of the gridConfigurationDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteGridConfiguration(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete GridConfiguration : {}", id);
        return gridConfigurationService
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
