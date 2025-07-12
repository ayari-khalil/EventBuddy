package dev.flonixa.com.service;

import dev.flonixa.com.repository.GridConfigurationRepository;
import dev.flonixa.com.service.dto.GridConfigurationDTO;
import dev.flonixa.com.service.mapper.GridConfigurationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link dev.flonixa.com.domain.GridConfiguration}.
 */
@Service
@Transactional
public class GridConfigurationService {

    private static final Logger LOG = LoggerFactory.getLogger(GridConfigurationService.class);

    private final GridConfigurationRepository gridConfigurationRepository;

    private final GridConfigurationMapper gridConfigurationMapper;

    public GridConfigurationService(
        GridConfigurationRepository gridConfigurationRepository,
        GridConfigurationMapper gridConfigurationMapper
    ) {
        this.gridConfigurationRepository = gridConfigurationRepository;
        this.gridConfigurationMapper = gridConfigurationMapper;
    }

    /**
     * Save a gridConfiguration.
     *
     * @param gridConfigurationDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<GridConfigurationDTO> save(GridConfigurationDTO gridConfigurationDTO) {
        LOG.debug("Request to save GridConfiguration : {}", gridConfigurationDTO);
        return gridConfigurationRepository.save(gridConfigurationMapper.toEntity(gridConfigurationDTO)).map(gridConfigurationMapper::toDto);
    }

    /**
     * Update a gridConfiguration.
     *
     * @param gridConfigurationDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<GridConfigurationDTO> update(GridConfigurationDTO gridConfigurationDTO) {
        LOG.debug("Request to update GridConfiguration : {}", gridConfigurationDTO);
        return gridConfigurationRepository.save(gridConfigurationMapper.toEntity(gridConfigurationDTO)).map(gridConfigurationMapper::toDto);
    }

    /**
     * Partially update a gridConfiguration.
     *
     * @param gridConfigurationDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<GridConfigurationDTO> partialUpdate(GridConfigurationDTO gridConfigurationDTO) {
        LOG.debug("Request to partially update GridConfiguration : {}", gridConfigurationDTO);

        return gridConfigurationRepository
            .findById(gridConfigurationDTO.getId())
            .map(existingGridConfiguration -> {
                gridConfigurationMapper.partialUpdate(existingGridConfiguration, gridConfigurationDTO);

                return existingGridConfiguration;
            })
            .flatMap(gridConfigurationRepository::save)
            .map(gridConfigurationMapper::toDto);
    }

    /**
     * Get all the gridConfigurations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<GridConfigurationDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all GridConfigurations");
        return gridConfigurationRepository.findAllBy(pageable).map(gridConfigurationMapper::toDto);
    }

    /**
     * Returns the number of gridConfigurations available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return gridConfigurationRepository.count();
    }

    /**
     * Get one gridConfiguration by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<GridConfigurationDTO> findOne(Long id) {
        LOG.debug("Request to get GridConfiguration : {}", id);
        return gridConfigurationRepository.findById(id).map(gridConfigurationMapper::toDto);
    }

    /**
     * Delete the gridConfiguration by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        LOG.debug("Request to delete GridConfiguration : {}", id);
        return gridConfigurationRepository.deleteById(id);
    }
}
