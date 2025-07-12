package dev.flonixa.com.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link dev.flonixa.com.domain.GridConfiguration} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridConfigurationDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private String gridName;

    private Integer pageSize;

    private String pagerAllowedPageSizes;

    private Boolean pagerShowPageSizeSelector;

    private Boolean pagerShowNavigationButtons;

    private Boolean allowSorting;

    private String sortingMode;

    private Boolean allowFiltering;

    private Boolean filterRowVisible;

    private Boolean headerFilterVisible;

    private Boolean allowSearch;

    private Boolean searchPanelVisible;

    private Integer searchPanelWidth;

    private String searchPanelPlaceholder;

    private Boolean allowColumnChooser;

    private Boolean columnChooserEnabled;

    private Boolean columnHidingEnabled;

    private Boolean allowExport;

    private Boolean exportEnabled;

    private String exportFileName;

    private Boolean allowGrouping;

    private Boolean groupPanelVisible;

    private Boolean allowColumnReordering;

    private Boolean allowColumnResizing;

    private String selectionMode;

    private Boolean selectionAllowSelectAll;

    private String selectionShowCheckBoxesMode;

    private String editingMode;

    private Boolean editingAllowAdding;

    private Boolean editingAllowUpdating;

    private Boolean editingAllowDeleting;

    private Instant createdDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGridName() {
        return gridName;
    }

    public void setGridName(String gridName) {
        this.gridName = gridName;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getPagerAllowedPageSizes() {
        return pagerAllowedPageSizes;
    }

    public void setPagerAllowedPageSizes(String pagerAllowedPageSizes) {
        this.pagerAllowedPageSizes = pagerAllowedPageSizes;
    }

    public Boolean getPagerShowPageSizeSelector() {
        return pagerShowPageSizeSelector;
    }

    public void setPagerShowPageSizeSelector(Boolean pagerShowPageSizeSelector) {
        this.pagerShowPageSizeSelector = pagerShowPageSizeSelector;
    }

    public Boolean getPagerShowNavigationButtons() {
        return pagerShowNavigationButtons;
    }

    public void setPagerShowNavigationButtons(Boolean pagerShowNavigationButtons) {
        this.pagerShowNavigationButtons = pagerShowNavigationButtons;
    }

    public Boolean getAllowSorting() {
        return allowSorting;
    }

    public void setAllowSorting(Boolean allowSorting) {
        this.allowSorting = allowSorting;
    }

    public String getSortingMode() {
        return sortingMode;
    }

    public void setSortingMode(String sortingMode) {
        this.sortingMode = sortingMode;
    }

    public Boolean getAllowFiltering() {
        return allowFiltering;
    }

    public void setAllowFiltering(Boolean allowFiltering) {
        this.allowFiltering = allowFiltering;
    }

    public Boolean getFilterRowVisible() {
        return filterRowVisible;
    }

    public void setFilterRowVisible(Boolean filterRowVisible) {
        this.filterRowVisible = filterRowVisible;
    }

    public Boolean getHeaderFilterVisible() {
        return headerFilterVisible;
    }

    public void setHeaderFilterVisible(Boolean headerFilterVisible) {
        this.headerFilterVisible = headerFilterVisible;
    }

    public Boolean getAllowSearch() {
        return allowSearch;
    }

    public void setAllowSearch(Boolean allowSearch) {
        this.allowSearch = allowSearch;
    }

    public Boolean getSearchPanelVisible() {
        return searchPanelVisible;
    }

    public void setSearchPanelVisible(Boolean searchPanelVisible) {
        this.searchPanelVisible = searchPanelVisible;
    }

    public Integer getSearchPanelWidth() {
        return searchPanelWidth;
    }

    public void setSearchPanelWidth(Integer searchPanelWidth) {
        this.searchPanelWidth = searchPanelWidth;
    }

    public String getSearchPanelPlaceholder() {
        return searchPanelPlaceholder;
    }

    public void setSearchPanelPlaceholder(String searchPanelPlaceholder) {
        this.searchPanelPlaceholder = searchPanelPlaceholder;
    }

    public Boolean getAllowColumnChooser() {
        return allowColumnChooser;
    }

    public void setAllowColumnChooser(Boolean allowColumnChooser) {
        this.allowColumnChooser = allowColumnChooser;
    }

    public Boolean getColumnChooserEnabled() {
        return columnChooserEnabled;
    }

    public void setColumnChooserEnabled(Boolean columnChooserEnabled) {
        this.columnChooserEnabled = columnChooserEnabled;
    }

    public Boolean getColumnHidingEnabled() {
        return columnHidingEnabled;
    }

    public void setColumnHidingEnabled(Boolean columnHidingEnabled) {
        this.columnHidingEnabled = columnHidingEnabled;
    }

    public Boolean getAllowExport() {
        return allowExport;
    }

    public void setAllowExport(Boolean allowExport) {
        this.allowExport = allowExport;
    }

    public Boolean getExportEnabled() {
        return exportEnabled;
    }

    public void setExportEnabled(Boolean exportEnabled) {
        this.exportEnabled = exportEnabled;
    }

    public String getExportFileName() {
        return exportFileName;
    }

    public void setExportFileName(String exportFileName) {
        this.exportFileName = exportFileName;
    }

    public Boolean getAllowGrouping() {
        return allowGrouping;
    }

    public void setAllowGrouping(Boolean allowGrouping) {
        this.allowGrouping = allowGrouping;
    }

    public Boolean getGroupPanelVisible() {
        return groupPanelVisible;
    }

    public void setGroupPanelVisible(Boolean groupPanelVisible) {
        this.groupPanelVisible = groupPanelVisible;
    }

    public Boolean getAllowColumnReordering() {
        return allowColumnReordering;
    }

    public void setAllowColumnReordering(Boolean allowColumnReordering) {
        this.allowColumnReordering = allowColumnReordering;
    }

    public Boolean getAllowColumnResizing() {
        return allowColumnResizing;
    }

    public void setAllowColumnResizing(Boolean allowColumnResizing) {
        this.allowColumnResizing = allowColumnResizing;
    }

    public String getSelectionMode() {
        return selectionMode;
    }

    public void setSelectionMode(String selectionMode) {
        this.selectionMode = selectionMode;
    }

    public Boolean getSelectionAllowSelectAll() {
        return selectionAllowSelectAll;
    }

    public void setSelectionAllowSelectAll(Boolean selectionAllowSelectAll) {
        this.selectionAllowSelectAll = selectionAllowSelectAll;
    }

    public String getSelectionShowCheckBoxesMode() {
        return selectionShowCheckBoxesMode;
    }

    public void setSelectionShowCheckBoxesMode(String selectionShowCheckBoxesMode) {
        this.selectionShowCheckBoxesMode = selectionShowCheckBoxesMode;
    }

    public String getEditingMode() {
        return editingMode;
    }

    public void setEditingMode(String editingMode) {
        this.editingMode = editingMode;
    }

    public Boolean getEditingAllowAdding() {
        return editingAllowAdding;
    }

    public void setEditingAllowAdding(Boolean editingAllowAdding) {
        this.editingAllowAdding = editingAllowAdding;
    }

    public Boolean getEditingAllowUpdating() {
        return editingAllowUpdating;
    }

    public void setEditingAllowUpdating(Boolean editingAllowUpdating) {
        this.editingAllowUpdating = editingAllowUpdating;
    }

    public Boolean getEditingAllowDeleting() {
        return editingAllowDeleting;
    }

    public void setEditingAllowDeleting(Boolean editingAllowDeleting) {
        this.editingAllowDeleting = editingAllowDeleting;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GridConfigurationDTO)) {
            return false;
        }

        GridConfigurationDTO gridConfigurationDTO = (GridConfigurationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, gridConfigurationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridConfigurationDTO{" +
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
