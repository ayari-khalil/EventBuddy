package dev.flonixa.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A GridColumn.
 */
@Table("grid_column")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridColumn implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("data_field")
    private String dataField;

    @Column("caption")
    private String caption;

    @Column("visible")
    private Boolean visible;

    @Column("data_type")
    private String dataType;

    @Column("format")
    private String format;

    @Column("width")
    private Integer width;

    @Column("allow_sorting")
    private Boolean allowSorting;

    @Column("allow_filtering")
    private Boolean allowFiltering;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "columns", "toolbarItems" }, allowSetters = true)
    private GridConfiguration gridConfiguration;

    @Column("grid_configuration_id")
    private Long gridConfigurationId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GridColumn id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDataField() {
        return this.dataField;
    }

    public GridColumn dataField(String dataField) {
        this.setDataField(dataField);
        return this;
    }

    public void setDataField(String dataField) {
        this.dataField = dataField;
    }

    public String getCaption() {
        return this.caption;
    }

    public GridColumn caption(String caption) {
        this.setCaption(caption);
        return this;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Boolean getVisible() {
        return this.visible;
    }

    public GridColumn visible(Boolean visible) {
        this.setVisible(visible);
        return this;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public String getDataType() {
        return this.dataType;
    }

    public GridColumn dataType(String dataType) {
        this.setDataType(dataType);
        return this;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getFormat() {
        return this.format;
    }

    public GridColumn format(String format) {
        this.setFormat(format);
        return this;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public Integer getWidth() {
        return this.width;
    }

    public GridColumn width(Integer width) {
        this.setWidth(width);
        return this;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Boolean getAllowSorting() {
        return this.allowSorting;
    }

    public GridColumn allowSorting(Boolean allowSorting) {
        this.setAllowSorting(allowSorting);
        return this;
    }

    public void setAllowSorting(Boolean allowSorting) {
        this.allowSorting = allowSorting;
    }

    public Boolean getAllowFiltering() {
        return this.allowFiltering;
    }

    public GridColumn allowFiltering(Boolean allowFiltering) {
        this.setAllowFiltering(allowFiltering);
        return this;
    }

    public void setAllowFiltering(Boolean allowFiltering) {
        this.allowFiltering = allowFiltering;
    }

    public GridConfiguration getGridConfiguration() {
        return this.gridConfiguration;
    }

    public void setGridConfiguration(GridConfiguration gridConfiguration) {
        this.gridConfiguration = gridConfiguration;
        this.gridConfigurationId = gridConfiguration != null ? gridConfiguration.getId() : null;
    }

    public GridColumn gridConfiguration(GridConfiguration gridConfiguration) {
        this.setGridConfiguration(gridConfiguration);
        return this;
    }

    public Long getGridConfigurationId() {
        return this.gridConfigurationId;
    }

    public void setGridConfigurationId(Long gridConfiguration) {
        this.gridConfigurationId = gridConfiguration;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GridColumn)) {
            return false;
        }
        return getId() != null && getId().equals(((GridColumn) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridColumn{" +
            "id=" + getId() +
            ", dataField='" + getDataField() + "'" +
            ", caption='" + getCaption() + "'" +
            ", visible='" + getVisible() + "'" +
            ", dataType='" + getDataType() + "'" +
            ", format='" + getFormat() + "'" +
            ", width=" + getWidth() +
            ", allowSorting='" + getAllowSorting() + "'" +
            ", allowFiltering='" + getAllowFiltering() + "'" +
            "}";
    }
}
