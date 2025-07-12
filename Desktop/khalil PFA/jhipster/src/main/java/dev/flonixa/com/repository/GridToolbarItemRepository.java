package dev.flonixa.com.repository;

import dev.flonixa.com.domain.GridToolbarItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the GridToolbarItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GridToolbarItemRepository extends ReactiveCrudRepository<GridToolbarItem, Long>, GridToolbarItemRepositoryInternal {
    Flux<GridToolbarItem> findAllBy(Pageable pageable);

    @Override
    Mono<GridToolbarItem> findOneWithEagerRelationships(Long id);

    @Override
    Flux<GridToolbarItem> findAllWithEagerRelationships();

    @Override
    Flux<GridToolbarItem> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM grid_toolbar_item entity WHERE entity.grid_configuration_id = :id")
    Flux<GridToolbarItem> findByGridConfiguration(Long id);

    @Query("SELECT * FROM grid_toolbar_item entity WHERE entity.grid_configuration_id IS NULL")
    Flux<GridToolbarItem> findAllWhereGridConfigurationIsNull();

    @Override
    <S extends GridToolbarItem> Mono<S> save(S entity);

    @Override
    Flux<GridToolbarItem> findAll();

    @Override
    Mono<GridToolbarItem> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface GridToolbarItemRepositoryInternal {
    <S extends GridToolbarItem> Mono<S> save(S entity);

    Flux<GridToolbarItem> findAllBy(Pageable pageable);

    Flux<GridToolbarItem> findAll();

    Mono<GridToolbarItem> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<GridToolbarItem> findAllBy(Pageable pageable, Criteria criteria);

    Mono<GridToolbarItem> findOneWithEagerRelationships(Long id);

    Flux<GridToolbarItem> findAllWithEagerRelationships();

    Flux<GridToolbarItem> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
