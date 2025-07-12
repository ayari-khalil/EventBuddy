package dev.flonixa.com.repository.rowmapper;

import dev.flonixa.com.domain.GridToolbarItem;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link GridToolbarItem}, with proper type conversions.
 */
@Service
public class GridToolbarItemRowMapper implements BiFunction<Row, String, GridToolbarItem> {

    private final ColumnConverter converter;

    public GridToolbarItemRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link GridToolbarItem} stored in the database.
     */
    @Override
    public GridToolbarItem apply(Row row, String prefix) {
        GridToolbarItem entity = new GridToolbarItem();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setLocation(converter.fromRow(row, prefix + "_location", String.class));
        entity.setWidget(converter.fromRow(row, prefix + "_widget", String.class));
        entity.setIcon(converter.fromRow(row, prefix + "_icon", String.class));
        entity.setText(converter.fromRow(row, prefix + "_text", String.class));
        entity.setHint(converter.fromRow(row, prefix + "_hint", String.class));
        entity.setOnClickAction(converter.fromRow(row, prefix + "_on_click_action", String.class));
        entity.setVisible(converter.fromRow(row, prefix + "_visible", Boolean.class));
        entity.setGridConfigurationId(converter.fromRow(row, prefix + "_grid_configuration_id", Long.class));
        return entity;
    }
}
