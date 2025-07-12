package dev.flonixa.com.repository.rowmapper;

import dev.flonixa.com.domain.GridConfiguration;
import io.r2dbc.spi.Row;
import java.time.Instant;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link GridConfiguration}, with proper type conversions.
 */
@Service
public class GridConfigurationRowMapper implements BiFunction<Row, String, GridConfiguration> {

    private final ColumnConverter converter;

    public GridConfigurationRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link GridConfiguration} stored in the database.
     */
    @Override
    public GridConfiguration apply(Row row, String prefix) {
        GridConfiguration entity = new GridConfiguration();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setGridName(converter.fromRow(row, prefix + "_grid_name", String.class));
        entity.setPageSize(converter.fromRow(row, prefix + "_page_size", Integer.class));
        entity.setPagerAllowedPageSizes(converter.fromRow(row, prefix + "_pager_allowed_page_sizes", String.class));
        entity.setPagerShowPageSizeSelector(converter.fromRow(row, prefix + "_pager_show_page_size_selector", Boolean.class));
        entity.setPagerShowNavigationButtons(converter.fromRow(row, prefix + "_pager_show_navigation_buttons", Boolean.class));
        entity.setAllowSorting(converter.fromRow(row, prefix + "_allow_sorting", Boolean.class));
        entity.setSortingMode(converter.fromRow(row, prefix + "_sorting_mode", String.class));
        entity.setAllowFiltering(converter.fromRow(row, prefix + "_allow_filtering", Boolean.class));
        entity.setFilterRowVisible(converter.fromRow(row, prefix + "_filter_row_visible", Boolean.class));
        entity.setHeaderFilterVisible(converter.fromRow(row, prefix + "_header_filter_visible", Boolean.class));
        entity.setAllowSearch(converter.fromRow(row, prefix + "_allow_search", Boolean.class));
        entity.setSearchPanelVisible(converter.fromRow(row, prefix + "_search_panel_visible", Boolean.class));
        entity.setSearchPanelWidth(converter.fromRow(row, prefix + "_search_panel_width", Integer.class));
        entity.setSearchPanelPlaceholder(converter.fromRow(row, prefix + "_search_panel_placeholder", String.class));
        entity.setAllowColumnChooser(converter.fromRow(row, prefix + "_allow_column_chooser", Boolean.class));
        entity.setColumnChooserEnabled(converter.fromRow(row, prefix + "_column_chooser_enabled", Boolean.class));
        entity.setColumnHidingEnabled(converter.fromRow(row, prefix + "_column_hiding_enabled", Boolean.class));
        entity.setAllowExport(converter.fromRow(row, prefix + "_allow_export", Boolean.class));
        entity.setExportEnabled(converter.fromRow(row, prefix + "_export_enabled", Boolean.class));
        entity.setExportFileName(converter.fromRow(row, prefix + "_export_file_name", String.class));
        entity.setAllowGrouping(converter.fromRow(row, prefix + "_allow_grouping", Boolean.class));
        entity.setGroupPanelVisible(converter.fromRow(row, prefix + "_group_panel_visible", Boolean.class));
        entity.setAllowColumnReordering(converter.fromRow(row, prefix + "_allow_column_reordering", Boolean.class));
        entity.setAllowColumnResizing(converter.fromRow(row, prefix + "_allow_column_resizing", Boolean.class));
        entity.setSelectionMode(converter.fromRow(row, prefix + "_selection_mode", String.class));
        entity.setSelectionAllowSelectAll(converter.fromRow(row, prefix + "_selection_allow_select_all", Boolean.class));
        entity.setSelectionShowCheckBoxesMode(converter.fromRow(row, prefix + "_selection_show_check_boxes_mode", String.class));
        entity.setEditingMode(converter.fromRow(row, prefix + "_editing_mode", String.class));
        entity.setEditingAllowAdding(converter.fromRow(row, prefix + "_editing_allow_adding", Boolean.class));
        entity.setEditingAllowUpdating(converter.fromRow(row, prefix + "_editing_allow_updating", Boolean.class));
        entity.setEditingAllowDeleting(converter.fromRow(row, prefix + "_editing_allow_deleting", Boolean.class));
        entity.setCreatedDate(converter.fromRow(row, prefix + "_created_date", Instant.class));
        return entity;
    }
}
