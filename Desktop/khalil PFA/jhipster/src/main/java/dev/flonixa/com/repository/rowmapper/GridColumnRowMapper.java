package dev.flonixa.com.repository.rowmapper;

import dev.flonixa.com.domain.GridColumn;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link GridColumn}, with proper type conversions.
 */
@Service
public class GridColumnRowMapper implements BiFunction<Row, String, GridColumn> {

    private final ColumnConverter converter;

    public GridColumnRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link GridColumn} stored in the database.
     */
    @Override
    public GridColumn apply(Row row, String prefix) {
        GridColumn entity = new GridColumn();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setDataField(converter.fromRow(row, prefix + "_data_field", String.class));
        entity.setCaption(converter.fromRow(row, prefix + "_caption", String.class));
        entity.setVisible(converter.fromRow(row, prefix + "_visible", Boolean.class));
        entity.setDataType(converter.fromRow(row, prefix + "_data_type", String.class));
        entity.setFormat(converter.fromRow(row, prefix + "_format", String.class));
        entity.setWidth(converter.fromRow(row, prefix + "_width", Integer.class));
        entity.setAllowSorting(converter.fromRow(row, prefix + "_allow_sorting", Boolean.class));
        entity.setAllowFiltering(converter.fromRow(row, prefix + "_allow_filtering", Boolean.class));
        entity.setGridConfigurationId(converter.fromRow(row, prefix + "_grid_configuration_id", Long.class));
        return entity;
    }
}
