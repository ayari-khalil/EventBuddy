package dev.flonixa.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A GridToolbarItem.
 */
@Table("grid_toolbar_item")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridToolbarItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("location")
    private String location;

    @Column("widget")
    private String widget;

    @Column("icon")
    private String icon;

    @Column("text")
    private String text;

    @Column("hint")
    private String hint;

    @Column("on_click_action")
    private String onClickAction;

    @Column("visible")
    private Boolean visible;

    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "columns", "toolbarItems" }, allowSetters = true)
    private GridConfiguration gridConfiguration;

    @Column("grid_configuration_id")
    private Long gridConfigurationId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GridToolbarItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocation() {
        return this.location;
    }

    public GridToolbarItem location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWidget() {
        return this.widget;
    }

    public GridToolbarItem widget(String widget) {
        this.setWidget(widget);
        return this;
    }

    public void setWidget(String widget) {
        this.widget = widget;
    }

    public String getIcon() {
        return this.icon;
    }

    public GridToolbarItem icon(String icon) {
        this.setIcon(icon);
        return this;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getText() {
        return this.text;
    }

    public GridToolbarItem text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getHint() {
        return this.hint;
    }

    public GridToolbarItem hint(String hint) {
        this.setHint(hint);
        return this;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public String getOnClickAction() {
        return this.onClickAction;
    }

    public GridToolbarItem onClickAction(String onClickAction) {
        this.setOnClickAction(onClickAction);
        return this;
    }

    public void setOnClickAction(String onClickAction) {
        this.onClickAction = onClickAction;
    }

    public Boolean getVisible() {
        return this.visible;
    }

    public GridToolbarItem visible(Boolean visible) {
        this.setVisible(visible);
        return this;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public GridConfiguration getGridConfiguration() {
        return this.gridConfiguration;
    }

    public void setGridConfiguration(GridConfiguration gridConfiguration) {
        this.gridConfiguration = gridConfiguration;
        this.gridConfigurationId = gridConfiguration != null ? gridConfiguration.getId() : null;
    }

    public GridToolbarItem gridConfiguration(GridConfiguration gridConfiguration) {
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
        if (!(o instanceof GridToolbarItem)) {
            return false;
        }
        return getId() != null && getId().equals(((GridToolbarItem) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridToolbarItem{" +
            "id=" + getId() +
            ", location='" + getLocation() + "'" +
            ", widget='" + getWidget() + "'" +
            ", icon='" + getIcon() + "'" +
            ", text='" + getText() + "'" +
            ", hint='" + getHint() + "'" +
            ", onClickAction='" + getOnClickAction() + "'" +
            ", visible='" + getVisible() + "'" +
            "}";
    }
}
