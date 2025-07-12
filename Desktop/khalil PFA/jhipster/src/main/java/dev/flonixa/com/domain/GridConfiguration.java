package dev.flonixa.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A GridConfiguration.
 */
@Table("grid_configuration")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridConfiguration implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("grid_name")
    private String gridName;

    @Column("page_size")
    private Integer pageSize;

    @Column("pager_allowed_page_sizes")
    private String pagerAllowedPageSizes;

    @Column("pager_show_page_size_selector")
    private Boolean pagerShowPageSizeSelector;

    @Column("pager_show_navigation_buttons")
    private Boolean pagerShowNavigationButtons;

    @Column("allow_sorting")
    private Boolean allowSorting;

    @Column("sorting_mode")
    private String sortingMode;

    @Column("allow_filtering")
    private Boolean allowFiltering;

    @Column("filter_row_visible")
    private Boolean filterRowVisible;

    @Column("header_filter_visible")
    private Boolean headerFilterVisible;

    @Column("allow_search")
    private Boolean allowSearch;

    @Column("search_panel_visible")
    private Boolean searchPanelVisible;

    @Column("search_panel_width")
    private Integer searchPanelWidth;

    @Column("search_panel_placeholder")
    private String searchPanelPlaceholder;

    @Column("allow_column_chooser")
    private Boolean allowColumnChooser;

    @Column("column_chooser_enabled")
    private Boolean columnChooserEnabled;

    @Column("column_hiding_enabled")
    private Boolean columnHidingEnabled;

    @Column("allow_export")
    private Boolean allowExport;

    @Column("export_enabled")
    private Boolean exportEnabled;

    @Column("export_file_name")
    private String exportFileName;

    @Column("allow_grouping")
    private Boolean allowGrouping;

    @Column("group_panel_visible")
    private Boolean groupPanelVisible;

    @Column("allow_column_reordering")
    private Boolean allowColumnReordering;

    @Column("allow_column_resizing")
    private Boolean allowColumnResizing;

    @Column("selection_mode")
    private String selectionMode;

    @Column("selection_allow_select_all")
    private Boolean selectionAllowSelectAll;

    @Column("selection_show_check_boxes_mode")
    private String selectionShowCheckBoxesMode;

    @Column("editing_mode")
    private String editingMode;

    @Column("editing_allow_adding")
    private Boolean editingAllowAdding;

    @Column("editing_allow_updating")
    private Boolean editingAllowUpdating;

    @Column("editing_allow_deleting")
    private Boolean editingAllowDeleting;

    @Column("created_date")
    private Instant createdDate;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "gridConfiguration" }, allowSetters = true)
    private Set<GridColumn> columns = new HashSet<>();

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "gridConfiguration" }, allowSetters = true)
    private Set<GridToolbarItem> toolbarItems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GridConfiguration id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGridName() {
        return this.gridName;
    }

    public GridConfiguration gridName(String gridName) {
        this.setGridName(gridName);
        return this;
    }

    public void setGridName(String gridName) {
        this.gridName = gridName;
    }

    public Integer getPageSize() {
        return this.pageSize;
    }

    public GridConfiguration pageSize(Integer pageSize) {
        this.setPageSize(pageSize);
        return this;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getPagerAllowedPageSizes() {
        return this.pagerAllowedPageSizes;
    }

    public GridConfiguration pagerAllowedPageSizes(String pagerAllowedPageSizes) {
        this.setPagerAllowedPageSizes(pagerAllowedPageSizes);
        return this;
    }

    public void setPagerAllowedPageSizes(String pagerAllowedPageSizes) {
        this.pagerAllowedPageSizes = pagerAllowedPageSizes;
    }

    public Boolean getPagerShowPageSizeSelector() {
        return this.pagerShowPageSizeSelector;
    }

    public GridConfiguration pagerShowPageSizeSelector(Boolean pagerShowPageSizeSelector) {
        this.setPagerShowPageSizeSelector(pagerShowPageSizeSelector);
        return this;
    }

    public void setPagerShowPageSizeSelector(Boolean pagerShowPageSizeSelector) {
        this.pagerShowPageSizeSelector = pagerShowPageSizeSelector;
    }

    public Boolean getPagerShowNavigationButtons() {
        return this.pagerShowNavigationButtons;
    }

    public GridConfiguration pagerShowNavigationButtons(Boolean pagerShowNavigationButtons) {
        this.setPagerShowNavigationButtons(pagerShowNavigationButtons);
        return this;
    }

    public void setPagerShowNavigationButtons(Boolean pagerShowNavigationButtons) {
        this.pagerShowNavigationButtons = pagerShowNavigationButtons;
    }

    public Boolean getAllowSorting() {
        return this.allowSorting;
    }

    public GridConfiguration allowSorting(Boolean allowSorting) {
        this.setAllowSorting(allowSorting);
        return this;
    }

    public void setAllowSorting(Boolean allowSorting) {
        this.allowSorting = allowSorting;
    }

    public String getSortingMode() {
        return this.sortingMode;
    }

    public GridConfiguration sortingMode(String sortingMode) {
        this.setSortingMode(sortingMode);
        return this;
    }

    public void setSortingMode(String sortingMode) {
        this.sortingMode = sortingMode;
    }

    public Boolean getAllowFiltering() {
        return this.allowFiltering;
    }

    public GridConfiguration allowFiltering(Boolean allowFiltering) {
        this.setAllowFiltering(allowFiltering);
        return this;
    }

    public void setAllowFiltering(Boolean allowFiltering) {
        this.allowFiltering = allowFiltering;
    }

    public Boolean getFilterRowVisible() {
        return this.filterRowVisible;
    }

    public GridConfiguration filterRowVisible(Boolean filterRowVisible) {
        this.setFilterRowVisible(filterRowVisible);
        return this;
    }

    public void setFilterRowVisible(Boolean filterRowVisible) {
        this.filterRowVisible = filterRowVisible;
    }

    public Boolean getHeaderFilterVisible() {
        return this.headerFilterVisible;
    }

    public GridConfiguration headerFilterVisible(Boolean headerFilterVisible) {
        this.setHeaderFilterVisible(headerFilterVisible);
        return this;
    }

    public void setHeaderFilterVisible(Boolean headerFilterVisible) {
        this.headerFilterVisible = headerFilterVisible;
    }

    public Boolean getAllowSearch() {
        return this.allowSearch;
    }

    public GridConfiguration allowSearch(Boolean allowSearch) {
        this.setAllowSearch(allowSearch);
        return this;
    }

    public void setAllowSearch(Boolean allowSearch) {
        this.allowSearch = allowSearch;
    }

    public Boolean getSearchPanelVisible() {
        return this.searchPanelVisible;
    }

    public GridConfiguration searchPanelVisible(Boolean searchPanelVisible) {
        this.setSearchPanelVisible(searchPanelVisible);
        return this;
    }

    public void setSearchPanelVisible(Boolean searchPanelVisible) {
        this.searchPanelVisible = searchPanelVisible;
    }

    public Integer getSearchPanelWidth() {
        return this.searchPanelWidth;
    }

    public GridConfiguration searchPanelWidth(Integer searchPanelWidth) {
        this.setSearchPanelWidth(searchPanelWidth);
        return this;
    }

    public void setSearchPanelWidth(Integer searchPanelWidth) {
        this.searchPanelWidth = searchPanelWidth;
    }

    public String getSearchPanelPlaceholder() {
        return this.searchPanelPlaceholder;
    }

    public GridConfiguration searchPanelPlaceholder(String searchPanelPlaceholder) {
        this.setSearchPanelPlaceholder(searchPanelPlaceholder);
        return this;
    }

    public void setSearchPanelPlaceholder(String searchPanelPlaceholder) {
        this.searchPanelPlaceholder = searchPanelPlaceholder;
    }

    public Boolean getAllowColumnChooser() {
        return this.allowColumnChooser;
    }

    public GridConfiguration allowColumnChooser(Boolean allowColumnChooser) {
        this.setAllowColumnChooser(allowColumnChooser);
        return this;
    }

    public void setAllowColumnChooser(Boolean allowColumnChooser) {
        this.allowColumnChooser = allowColumnChooser;
    }

    public Boolean getColumnChooserEnabled() {
        return this.columnChooserEnabled;
    }

    public GridConfiguration columnChooserEnabled(Boolean columnChooserEnabled) {
        this.setColumnChooserEnabled(columnChooserEnabled);
        return this;
    }

    public void setColumnChooserEnabled(Boolean columnChooserEnabled) {
        this.columnChooserEnabled = columnChooserEnabled;
    }

    public Boolean getColumnHidingEnabled() {
        return this.columnHidingEnabled;
    }

    public GridConfiguration columnHidingEnabled(Boolean columnHidingEnabled) {
        this.setColumnHidingEnabled(columnHidingEnabled);
        return this;
    }

    public void setColumnHidingEnabled(Boolean columnHidingEnabled) {
        this.columnHidingEnabled = columnHidingEnabled;
    }

    public Boolean getAllowExport() {
        return this.allowExport;
    }

    public GridConfiguration allowExport(Boolean allowExport) {
        this.setAllowExport(allowExport);
        return this;
    }

    public void setAllowExport(Boolean allowExport) {
        this.allowExport = allowExport;
    }

    public Boolean getExportEnabled() {
        return this.exportEnabled;
    }

    public GridConfiguration exportEnabled(Boolean exportEnabled) {
        this.setExportEnabled(exportEnabled);
        return this;
    }

    public void setExportEnabled(Boolean exportEnabled) {
        this.exportEnabled = exportEnabled;
    }

    public String getExportFileName() {
        return this.exportFileName;
    }

    public GridConfiguration exportFileName(String exportFileName) {
        this.setExportFileName(exportFileName);
        return this;
    }

    public void setExportFileName(String exportFileName) {
        this.exportFileName = exportFileName;
    }

    public Boolean getAllowGrouping() {
        return this.allowGrouping;
    }

    public GridConfiguration allowGrouping(Boolean allowGrouping) {
        this.setAllowGrouping(allowGrouping);
        return this;
    }

    public void setAllowGrouping(Boolean allowGrouping) {
        this.allowGrouping = allowGrouping;
    }

    public Boolean getGroupPanelVisible() {
        return this.groupPanelVisible;
    }

    public GridConfiguration groupPanelVisible(Boolean groupPanelVisible) {
        this.setGroupPanelVisible(groupPanelVisible);
        return this;
    }

    public void setGroupPanelVisible(Boolean groupPanelVisible) {
        this.groupPanelVisible = groupPanelVisible;
    }

    public Boolean getAllowColumnReordering() {
        return this.allowColumnReordering;
    }

    public GridConfiguration allowColumnReordering(Boolean allowColumnReordering) {
        this.setAllowColumnReordering(allowColumnReordering);
        return this;
    }

    public void setAllowColumnReordering(Boolean allowColumnReordering) {
        this.allowColumnReordering = allowColumnReordering;
    }

    public Boolean getAllowColumnResizing() {
        return this.allowColumnResizing;
    }

    public GridConfiguration allowColumnResizing(Boolean allowColumnResizing) {
        this.setAllowColumnResizing(allowColumnResizing);
        return this;
    }

    public void setAllowColumnResizing(Boolean allowColumnResizing) {
        this.allowColumnResizing = allowColumnResizing;
    }

    public String getSelectionMode() {
        return this.selectionMode;
    }

    public GridConfiguration selectionMode(String selectionMode) {
        this.setSelectionMode(selectionMode);
        return this;
    }

    public void setSelectionMode(String selectionMode) {
        this.selectionMode = selectionMode;
    }

    public Boolean getSelectionAllowSelectAll() {
        return this.selectionAllowSelectAll;
    }

    public GridConfiguration selectionAllowSelectAll(Boolean selectionAllowSelectAll) {
        this.setSelectionAllowSelectAll(selectionAllowSelectAll);
        return this;
    }

    public void setSelectionAllowSelectAll(Boolean selectionAllowSelectAll) {
        this.selectionAllowSelectAll = selectionAllowSelectAll;
    }

    public String getSelectionShowCheckBoxesMode() {
        return this.selectionShowCheckBoxesMode;
    }

    public GridConfiguration selectionShowCheckBoxesMode(String selectionShowCheckBoxesMode) {
        this.setSelectionShowCheckBoxesMode(selectionShowCheckBoxesMode);
        return this;
    }

    public void setSelectionShowCheckBoxesMode(String selectionShowCheckBoxesMode) {
        this.selectionShowCheckBoxesMode = selectionShowCheckBoxesMode;
    }

    public String getEditingMode() {
        return this.editingMode;
    }

    public GridConfiguration editingMode(String editingMode) {
        this.setEditingMode(editingMode);
        return this;
    }

    public void setEditingMode(String editingMode) {
        this.editingMode = editingMode;
    }

    public Boolean getEditingAllowAdding() {
        return this.editingAllowAdding;
    }

    public GridConfiguration editingAllowAdding(Boolean editingAllowAdding) {
        this.setEditingAllowAdding(editingAllowAdding);
        return this;
    }

    public void setEditingAllowAdding(Boolean editingAllowAdding) {
        this.editingAllowAdding = editingAllowAdding;
    }

    public Boolean getEditingAllowUpdating() {
        return this.editingAllowUpdating;
    }

    public GridConfiguration editingAllowUpdating(Boolean editingAllowUpdating) {
        this.setEditingAllowUpdating(editingAllowUpdating);
        return this;
    }

    public void setEditingAllowUpdating(Boolean editingAllowUpdating) {
        this.editingAllowUpdating = editingAllowUpdating;
    }

    public Boolean getEditingAllowDeleting() {
        return this.editingAllowDeleting;
    }

    public GridConfiguration editingAllowDeleting(Boolean editingAllowDeleting) {
        this.setEditingAllowDeleting(editingAllowDeleting);
        return this;
    }

    public void setEditingAllowDeleting(Boolean editingAllowDeleting) {
        this.editingAllowDeleting = editingAllowDeleting;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public GridConfiguration createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Set<GridColumn> getColumns() {
        return this.columns;
    }

    public void setColumns(Set<GridColumn> gridColumns) {
        if (this.columns != null) {
            this.columns.forEach(i -> i.setGridConfiguration(null));
        }
        if (gridColumns != null) {
            gridColumns.forEach(i -> i.setGridConfiguration(this));
        }
        this.columns = gridColumns;
    }

    public GridConfiguration columns(Set<GridColumn> gridColumns) {
        this.setColumns(gridColumns);
        return this;
    }

    public GridConfiguration addColumns(GridColumn gridColumn) {
        this.columns.add(gridColumn);
        gridColumn.setGridConfiguration(this);
        return this;
    }

    public GridConfiguration removeColumns(GridColumn gridColumn) {
        this.columns.remove(gridColumn);
        gridColumn.setGridConfiguration(null);
        return this;
    }

    public Set<GridToolbarItem> getToolbarItems() {
        return this.toolbarItems;
    }

    public void setToolbarItems(Set<GridToolbarItem> gridToolbarItems) {
        if (this.toolbarItems != null) {
            this.toolbarItems.forEach(i -> i.setGridConfiguration(null));
        }
        if (gridToolbarItems != null) {
            gridToolbarItems.forEach(i -> i.setGridConfiguration(this));
        }
        this.toolbarItems = gridToolbarItems;
    }

    public GridConfiguration toolbarItems(Set<GridToolbarItem> gridToolbarItems) {
        this.setToolbarItems(gridToolbarItems);
        return this;
    }

    public GridConfiguration addToolbarItems(GridToolbarItem gridToolbarItem) {
        this.toolbarItems.add(gridToolbarItem);
        gridToolbarItem.setGridConfiguration(this);
        return this;
    }

    public GridConfiguration removeToolbarItems(GridToolbarItem gridToolbarItem) {
        this.toolbarItems.remove(gridToolbarItem);
        gridToolbarItem.setGridConfiguration(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GridConfiguration)) {
            return false;
        }
        return getId() != null && getId().equals(((GridConfiguration) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridConfiguration{" +
            "id=" + getId() +
            ", gridName='" + getGridName() + "'" +
            ", pageSize=" + getPageSize() +
            ", pagerAllowedPageSizes='" + getPagerAllowedPageSizes() + "'" +
            ", pagerShowPageSizeSelector='" + getPagerShowPageSizeSelector() + "'" +
            ", pagerShowNavigationButtons='" + getPagerShowNavigationButtons() + "'" +
            ", allowSorting='" + getAllowSorting() + "'" +
            ", sortingMode='" + getSortingMode() + "'" +
            ", allowFiltering='" + getAllowFiltering() + "'" +
            ", filterRowVisible='" + getFilterRowVisible() + "'" +
            ", headerFilterVisible='" + getHeaderFilterVisible() + "'" +
            ", allowSearch='" + getAllowSearch() + "'" +
            ", searchPanelVisible='" + getSearchPanelVisible() + "'" +
            ", searchPanelWidth=" + getSearchPanelWidth() +
            ", searchPanelPlaceholder='" + getSearchPanelPlaceholder() + "'" +
            ", allowColumnChooser='" + getAllowColumnChooser() + "'" +
            ", columnChooserEnabled='" + getColumnChooserEnabled() + "'" +
            ", columnHidingEnabled='" + getColumnHidingEnabled() + "'" +
            ", allowExport='" + getAllowExport() + "'" +
            ", exportEnabled='" + getExportEnabled() + "'" +
            ", exportFileName='" + getExportFileName() + "'" +
            ", allowGrouping='" + getAllowGrouping() + "'" +
            ", groupPanelVisible='" + getGroupPanelVisible() + "'" +
            ", allowColumnReordering='" + getAllowColumnReordering() + "'" +
            ", allowColumnResizing='" + getAllowColumnResizing() + "'" +
            ", selectionMode='" + getSelectionMode() + "'" +
            ", selectionAllowSelectAll='" + getSelectionAllowSelectAll() + "'" +
            ", selectionShowCheckBoxesMode='" + getSelectionShowCheckBoxesMode() + "'" +
            ", editingMode='" + getEditingMode() + "'" +
            ", editingAllowAdding='" + getEditingAllowAdding() + "'" +
            ", editingAllowUpdating='" + getEditingAllowUpdating() + "'" +
            ", editingAllowDeleting='" + getEditingAllowDeleting() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
