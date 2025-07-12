package dev.flonixa.com.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class GridColumnSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("data_field", table, columnPrefix + "_data_field"));
        columns.add(Column.aliased("caption", table, columnPrefix + "_caption"));
        columns.add(Column.aliased("visible", table, columnPrefix + "_visible"));
        columns.add(Column.aliased("data_type", table, columnPrefix + "_data_type"));
        columns.add(Column.aliased("format", table, columnPrefix + "_format"));
        columns.add(Column.aliased("width", table, columnPrefix + "_width"));
        columns.add(Column.aliased("allow_sorting", table, columnPrefix + "_allow_sorting"));
        columns.add(Column.aliased("allow_filtering", table, columnPrefix + "_allow_filtering"));

        columns.add(Column.aliased("grid_configuration_id", table, columnPrefix + "_grid_configuration_id"));
        return columns;
    }
}
