package dev.flonixa.com.repository;

import dev.flonixa.com.domain.GridConfiguration;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the GridConfiguration entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GridConfigurationRepository extends ReactiveCrudRepository<GridConfiguration, Long>, GridConfigurationRepositoryInternal {
    Flux<GridConfiguration> findAllBy(Pageable pageable);

    @Override
    <S extends GridConfiguration> Mono<S> save(S entity);

    @Override
    Flux<GridConfiguration> findAll();

    @Override
    Mono<GridConfiguration> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface GridConfigurationRepositoryInternal {
    <S extends GridConfiguration> Mono<S> save(S entity);

    Flux<GridConfiguration> findAllBy(Pageable pageable);

    Flux<GridConfiguration> findAll();

    Mono<GridConfiguration> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<GridConfiguration> findAllBy(Pageable pageable, Criteria criteria);
}
