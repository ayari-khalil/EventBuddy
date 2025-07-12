package dev.flonixa.com.repository;

import dev.flonixa.com.domain.GridColumn;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the GridColumn entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GridColumnRepository extends ReactiveCrudRepository<GridColumn, Long>, GridColumnRepositoryInternal {
    Flux<GridColumn> findAllBy(Pageable pageable);

    @Override
    Mono<GridColumn> findOneWithEagerRelationships(Long id);

    @Override
    Flux<GridColumn> findAllWithEagerRelationships();

    @Override
    Flux<GridColumn> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM grid_column entity WHERE entity.grid_configuration_id = :id")
    Flux<GridColumn> findByGridConfiguration(Long id);

    @Query("SELECT * FROM grid_column entity WHERE entity.grid_configuration_id IS NULL")
    Flux<GridColumn> findAllWhereGridConfigurationIsNull();

    @Override
    <S extends GridColumn> Mono<S> save(S entity);

    @Override
    Flux<GridColumn> findAll();

    @Override
    Mono<GridColumn> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface GridColumnRepositoryInternal {
    <S extends GridColumn> Mono<S> save(S entity);

    Flux<GridColumn> findAllBy(Pageable pageable);

    Flux<GridColumn> findAll();

    Mono<GridColumn> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<GridColumn> findAllBy(Pageable pageable, Criteria criteria);

    Mono<GridColumn> findOneWithEagerRelationships(Long id);

    Flux<GridColumn> findAllWithEagerRelationships();

    Flux<GridColumn> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
