package dev.flonixa.com.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link dev.flonixa.com.domain.GridToolbarItem} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GridToolbarItemDTO implements Serializable {

    private Long id;

    private String location;

    private String widget;

    private String icon;

    private String text;

    private String hint;

    private String onClickAction;

    private Boolean visible;

    private GridConfigurationDTO gridConfiguration;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWidget() {
        return widget;
    }

    public void setWidget(String widget) {
        this.widget = widget;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public String getOnClickAction() {
        return onClickAction;
    }

    public void setOnClickAction(String onClickAction) {
        this.onClickAction = onClickAction;
    }

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
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
        if (!(o instanceof GridToolbarItemDTO)) {
            return false;
        }

        GridToolbarItemDTO gridToolbarItemDTO = (GridToolbarItemDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, gridToolbarItemDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GridToolbarItemDTO{" +
            "id=" + getId() +
            ", location='" + getLocation() + "'" +
            ", widget='" + getWidget() + "'" +
            ", icon='" + getIcon() + "'" +
            ", text='" + getText() + "'" +
            ", hint='" + getHint() + "'" +
            ", onClickAction='" + getOnClickAction() + "'" +
            ", visible='" + getVisible() + "'" +
            ", gridConfiguration=" + getGridConfiguration() +
            "}";
    }
}
