package dev.flonixa.com.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class GridToolbarItemSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("location", table, columnPrefix + "_location"));
        columns.add(Column.aliased("widget", table, columnPrefix + "_widget"));
        columns.add(Column.aliased("icon", table, columnPrefix + "_icon"));
        columns.add(Column.aliased("text", table, columnPrefix + "_text"));
        columns.add(Column.aliased("hint", table, columnPrefix + "_hint"));
        columns.add(Column.aliased("on_click_action", table, columnPrefix + "_on_click_action"));
        columns.add(Column.aliased("visible", table, columnPrefix + "_visible"));

        columns.add(Column.aliased("grid_configuration_id", table, columnPrefix + "_grid_configuration_id"));
        return columns;
    }
}
