package dev.flonixa.com.service;

import dev.flonixa.com.repository.GridToolbarItemRepository;
import dev.flonixa.com.service.dto.GridToolbarItemDTO;
import dev.flonixa.com.service.mapper.GridToolbarItemMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link dev.flonixa.com.domain.GridToolbarItem}.
 */
@Service
@Transactional
public class GridToolbarItemService {

    private static final Logger LOG = LoggerFactory.getLogger(GridToolbarItemService.class);

    private final GridToolbarItemRepository gridToolbarItemRepository;

    private final GridToolbarItemMapper gridToolbarItemMapper;

    public GridToolbarItemService(GridToolbarItemRepository gridToolbarItemRepository, GridToolbarItemMapper gridToolbarItemMapper) {
        this.gridToolbarItemRepository = gridToolbarItemRepository;
        this.gridToolbarItemMapper = gridToolbarItemMapper;
    }

    /**
     * Save a gridToolbarItem.
     *
     * @param gridToolbarItemDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<GridToolbarItemDTO> save(GridToolbarItemDTO gridToolbarItemDTO) {
        LOG.debug("Request to save GridToolbarItem : {}", gridToolbarItemDTO);
        return gridToolbarItemRepository.save(gridToolbarItemMapper.toEntity(gridToolbarItemDTO)).map(gridToolbarItemMapper::toDto);
    }

    /**
     * Update a gridToolbarItem.
     *
     * @param gridToolbarItemDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<GridToolbarItemDTO> update(GridToolbarItemDTO gridToolbarItemDTO) {
        LOG.debug("Request to update GridToolbarItem : {}", gridToolbarItemDTO);
        return gridToolbarItemRepository.save(gridToolbarItemMapper.toEntity(gridToolbarItemDTO)).map(gridToolbarItemMapper::toDto);
    }

    /**
     * Partially update a gridToolbarItem.
     *
     * @param gridToolbarItemDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<GridToolbarItemDTO> partialUpdate(GridToolbarItemDTO gridToolbarItemDTO) {
        LOG.debug("Request to partially update GridToolbarItem : {}", gridToolbarItemDTO);

        return gridToolbarItemRepository
            .findById(gridToolbarItemDTO.getId())
            .map(existingGridToolbarItem -> {
                gridToolbarItemMapper.partialUpdate(existingGridToolbarItem, gridToolbarItemDTO);

                return existingGridToolbarItem;
            })
            .flatMap(gridToolbarItemRepository::save)
            .map(gridToolbarItemMapper::toDto);
    }

    /**
     * Get all the gridToolbarItems.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<GridToolbarItemDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all GridToolbarItems");
        return gridToolbarItemRepository.findAllBy(pageable).map(gridToolbarItemMapper::toDto);
    }

    /**
     * Get all the gridToolbarItems with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Flux<GridToolbarItemDTO> findAllWithEagerRelationships(Pageable pageable) {
        return gridToolbarItemRepository.findAllWithEagerRelationships(pageable).map(gridToolbarItemMapper::toDto);
    }

    /**
     * Returns the number of gridToolbarItems available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return gridToolbarItemRepository.count();
    }

    /**
     * Get one gridToolbarItem by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<GridToolbarItemDTO> findOne(Long id) {
        LOG.debug("Request to get GridToolbarItem : {}", id);
        return gridToolbarItemRepository.findOneWithEagerRelationships(id).map(gridToolbarItemMapper::toDto);
    }

    /**
     * Delete the gridToolbarItem by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        LOG.debug("Request to delete GridToolbarItem : {}", id);
        return gridToolbarItemRepository.deleteById(id);
    }
}
