package dev.flonixa.com.repository;

import dev.flonixa.com.domain.GridColumn;
import dev.flonixa.com.repository.rowmapper.GridColumnRowMapper;
import dev.flonixa.com.repository.rowmapper.GridConfigurationRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Comparison;
import org.springframework.data.relational.core.sql.Condition;
import org.springframework.data.relational.core.sql.Conditions;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC custom repository implementation for the GridColumn entity.
 */
@SuppressWarnings("unused")
class GridColumnRepositoryInternalImpl extends SimpleR2dbcRepository<GridColumn, Long> implements GridColumnRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final GridConfigurationRowMapper gridconfigurationMapper;
    private final GridColumnRowMapper gridcolumnMapper;

    private static final Table entityTable = Table.aliased("grid_column", EntityManager.ENTITY_ALIAS);
    private static final Table gridConfigurationTable = Table.aliased("grid_configuration", "gridConfiguration");

    public GridColumnRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        GridConfigurationRowMapper gridconfigurationMapper,
        GridColumnRowMapper gridcolumnMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(GridColumn.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.gridconfigurationMapper = gridconfigurationMapper;
        this.gridcolumnMapper = gridcolumnMapper;
    }

    @Override
    public Flux<GridColumn> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<GridColumn> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = GridColumnSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(GridConfigurationSqlHelper.getColumns(gridConfigurationTable, "gridConfiguration"));
        SelectFromAndJoinCondition selectFrom = Select.builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(gridConfigurationTable)
            .on(Column.create("grid_configuration_id", entityTable))
            .equals(Column.create("id", gridConfigurationTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, GridColumn.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<GridColumn> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<GridColumn> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<GridColumn> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<GridColumn> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<GridColumn> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private GridColumn process(Row row, RowMetadata metadata) {
        GridColumn entity = gridcolumnMapper.apply(row, "e");
        entity.setGridConfiguration(gridconfigurationMapper.apply(row, "gridConfiguration"));
        return entity;
    }

    @Override
    public <S extends GridColumn> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
