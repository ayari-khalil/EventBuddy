package dev.flonixa.com.repository;

import dev.flonixa.com.domain.GridToolbarItem;
import dev.flonixa.com.repository.rowmapper.GridConfigurationRowMapper;
import dev.flonixa.com.repository.rowmapper.GridToolbarItemRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the GridToolbarItem entity.
 */
@SuppressWarnings("unused")
class GridToolbarItemRepositoryInternalImpl
    extends SimpleR2dbcRepository<GridToolbarItem, Long>
    implements GridToolbarItemRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final GridConfigurationRowMapper gridconfigurationMapper;
    private final GridToolbarItemRowMapper gridtoolbaritemMapper;

    private static final Table entityTable = Table.aliased("grid_toolbar_item", EntityManager.ENTITY_ALIAS);
    private static final Table gridConfigurationTable = Table.aliased("grid_configuration", "gridConfiguration");

    public GridToolbarItemRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        GridConfigurationRowMapper gridconfigurationMapper,
        GridToolbarItemRowMapper gridtoolbaritemMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(GridToolbarItem.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.gridconfigurationMapper = gridconfigurationMapper;
        this.gridtoolbaritemMapper = gridtoolbaritemMapper;
    }

    @Override
    public Flux<GridToolbarItem> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<GridToolbarItem> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = GridToolbarItemSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(GridConfigurationSqlHelper.getColumns(gridConfigurationTable, "gridConfiguration"));
        SelectFromAndJoinCondition selectFrom = Select.builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(gridConfigurationTable)
            .on(Column.create("grid_configuration_id", entityTable))
            .equals(Column.create("id", gridConfigurationTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, GridToolbarItem.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<GridToolbarItem> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<GridToolbarItem> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<GridToolbarItem> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<GridToolbarItem> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<GridToolbarItem> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private GridToolbarItem process(Row row, RowMetadata metadata) {
        GridToolbarItem entity = gridtoolbaritemMapper.apply(row, "e");
        entity.setGridConfiguration(gridconfigurationMapper.apply(row, "gridConfiguration"));
        return entity;
    }

    @Override
    public <S extends GridToolbarItem> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
