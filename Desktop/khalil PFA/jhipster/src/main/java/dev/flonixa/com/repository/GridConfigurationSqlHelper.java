package dev.flonixa.com.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class GridConfigurationSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("grid_name", table, columnPrefix + "_grid_name"));
        columns.add(Column.aliased("page_size", table, columnPrefix + "_page_size"));
        columns.add(Column.aliased("pager_allowed_page_sizes", table, columnPrefix + "_pager_allowed_page_sizes"));
        columns.add(Column.aliased("pager_show_page_size_selector", table, columnPrefix + "_pager_show_page_size_selector"));
        columns.add(Column.aliased("pager_show_navigation_buttons", table, columnPrefix + "_pager_show_navigation_buttons"));
        columns.add(Column.aliased("allow_sorting", table, columnPrefix + "_allow_sorting"));
        columns.add(Column.aliased("sorting_mode", table, columnPrefix + "_sorting_mode"));
        columns.add(Column.aliased("allow_filtering", table, columnPrefix + "_allow_filtering"));
        columns.add(Column.aliased("filter_row_visible", table, columnPrefix + "_filter_row_visible"));
        columns.add(Column.aliased("header_filter_visible", table, columnPrefix + "_header_filter_visible"));
        columns.add(Column.aliased("allow_search", table, columnPrefix + "_allow_search"));
        columns.add(Column.aliased("search_panel_visible", table, columnPrefix + "_search_panel_visible"));
        columns.add(Column.aliased("search_panel_width", table, columnPrefix + "_search_panel_width"));
        columns.add(Column.aliased("search_panel_placeholder", table, columnPrefix + "_search_panel_placeholder"));
        columns.add(Column.aliased("allow_column_chooser", table, columnPrefix + "_allow_column_chooser"));
        columns.add(Column.aliased("column_chooser_enabled", table, columnPrefix + "_column_chooser_enabled"));
        columns.add(Column.aliased("column_hiding_enabled", table, columnPrefix + "_column_hiding_enabled"));
        columns.add(Column.aliased("allow_export", table, columnPrefix + "_allow_export"));
        columns.add(Column.aliased("export_enabled", table, columnPrefix + "_export_enabled"));
        columns.add(Column.aliased("export_file_name", table, columnPrefix + "_export_file_name"));
        columns.add(Column.aliased("allow_grouping", table, columnPrefix + "_allow_grouping"));
        columns.add(Column.aliased("group_panel_visible", table, columnPrefix + "_group_panel_visible"));
        columns.add(Column.aliased("allow_column_reordering", table, columnPrefix + "_allow_column_reordering"));
        columns.add(Column.aliased("allow_column_resizing", table, columnPrefix + "_allow_column_resizing"));
        columns.add(Column.aliased("selection_mode", table, columnPrefix + "_selection_mode"));
        columns.add(Column.aliased("selection_allow_select_all", table, columnPrefix + "_selection_allow_select_all"));
        columns.add(Column.aliased("selection_show_check_boxes_mode", table, columnPrefix + "_selection_show_check_boxes_mode"));
        columns.add(Column.aliased("editing_mode", table, columnPrefix + "_editing_mode"));
        columns.add(Column.aliased("editing_allow_adding", table, columnPrefix + "_editing_allow_adding"));
        columns.add(Column.aliased("editing_allow_updating", table, columnPrefix + "_editing_allow_updating"));
        columns.add(Column.aliased("editing_allow_deleting", table, columnPrefix + "_editing_allow_deleting"));
        columns.add(Column.aliased("created_date", table, columnPrefix + "_created_date"));

        return columns;
    }
}
