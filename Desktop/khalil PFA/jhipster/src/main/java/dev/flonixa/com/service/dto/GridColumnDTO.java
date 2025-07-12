package dev.flonixa.com.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link dev.flonixa.com.domain.GridColumn} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridColumnDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private String dataField;

    private String caption;

    private Boolean visible;

    private String dataType;

    private String format;

    private Integer width;

    private Boolean allowSorting;

    private Boolean allowFiltering;

    private GridConfigurationDTO gridConfiguration;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDataField() {
        return dataField;
    }

    public void setDataField(String dataField) {
        this.dataField = dataField;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Boolean getAllowSorting() {
        return allowSorting;
    }

    public void setAllowSorting(Boolean allowSorting) {
        this.allowSorting = allowSorting;
    }

    public Boolean getAllowFiltering() {
        return allowFiltering;
    }

    public void setAllowFiltering(Boolean allowFiltering) {
        this.allowFiltering = allowFiltering;
    }

    public GridConfigurationDTO getGridConfiguration() {
        return gridConfiguration;
    }

    public void setGridConfiguration(GridConfigurationDTO gridConfiguration) {
        this.gridConfiguration = gridConfiguration;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GridColumnDTO)) {
            return false;
        }

        GridColumnDTO gridColumnDTO = (GridColumnDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, gridColumnDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridColumnDTO{" +
            "id=" + getId() +
            ", dataField='" + getDataField() + "'" +
            ", caption='" + getCaption() + "'" +
            ", visible='" + getVisible() + "'" +
            ", dataType='" + getDataType() + "'" +
            ", format='" + getFormat() + "'" +
            ", width=" + getWidth() +
            ", allowSorting='" + getAllowSorting() + "'" +
            ", allowFiltering='" + getAllowFiltering() + "'" +
            ", gridConfiguration=" + getGridConfiguration() +
            "}";
    }
}
