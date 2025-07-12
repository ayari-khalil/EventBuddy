package dev.flonixa.com.service;

import dev.flonixa.com.repository.GridColumnRepository;
import dev.flonixa.com.service.dto.GridColumnDTO;
import dev.flonixa.com.service.mapper.GridColumnMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link dev.flonixa.com.domain.GridColumn}.
 */
@Service
@Transactional
public class GridColumnService {

    private static final Logger LOG = LoggerFactory.getLogger(GridColumnService.class);

    private final GridColumnRepository gridColumnRepository;

    private final GridColumnMapper gridColumnMapper;

    public GridColumnService(GridColumnRepository gridColumnRepository, GridColumnMapper gridColumnMapper) {
        this.gridColumnRepository = gridColumnRepository;
        this.gridColumnMapper = gridColumnMapper;
    }

    /**
     * Save a gridColumn.
     *
     * @param gridColumnDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<GridColumnDTO> save(GridColumnDTO gridColumnDTO) {
        LOG.debug("Request to save GridColumn : {}", gridColumnDTO);
        return gridColumnRepository.save(gridColumnMapper.toEntity(gridColumnDTO)).map(gridColumnMapper::toDto);
    }

    /**
     * Update a gridColumn.
     *
     * @param gridColumnDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<GridColumnDTO> update(GridColumnDTO gridColumnDTO) {
        LOG.debug("Request to update GridColumn : {}", gridColumnDTO);
        return gridColumnRepository.save(gridColumnMapper.toEntity(gridColumnDTO)).map(gridColumnMapper::toDto);
    }

    /**
     * Partially update a gridColumn.
     *
     * @param gridColumnDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<GridColumnDTO> partialUpdate(GridColumnDTO gridColumnDTO) {
        LOG.debug("Request to partially update GridColumn : {}", gridColumnDTO);

        return gridColumnRepository
            .findById(gridColumnDTO.getId())
            .map(existingGridColumn -> {
                gridColumnMapper.partialUpdate(existingGridColumn, gridColumnDTO);

                return existingGridColumn;
            })
            .flatMap(gridColumnRepository::save)
            .map(gridColumnMapper::toDto);
    }

    /**
     * Get all the gridColumns.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<GridColumnDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all GridColumns");
        return gridColumnRepository.findAllBy(pageable).map(gridColumnMapper::toDto);
    }

    /**
     * Get all the gridColumns with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Flux<GridColumnDTO> findAllWithEagerRelationships(Pageable pageable) {
        return gridColumnRepository.findAllWithEagerRelationships(pageable).map(gridColumnMapper::toDto);
    }

    /**
     * Returns the number of gridColumns available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return gridColumnRepository.count();
    }

    /**
     * Get one gridColumn by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<GridColumnDTO> findOne(Long id) {
        LOG.debug("Request to get GridColumn : {}", id);
        return gridColumnRepository.findOneWithEagerRelationships(id).map(gridColumnMapper::toDto);
    }

    /**
     * Delete the gridColumn by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        LOG.debug("Request to delete GridColumn : {}", id);
        return gridColumnRepository.deleteById(id);
    }
}
