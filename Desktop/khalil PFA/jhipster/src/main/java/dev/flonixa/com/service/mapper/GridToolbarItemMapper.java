package dev.flonixa.com.service.mapper;

import dev.flonixa.com.domain.GridConfiguration;
import dev.flonixa.com.domain.GridToolbarItem;
import dev.flonixa.com.service.dto.GridConfigurationDTO;
import dev.flonixa.com.service.dto.GridToolbarItemDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GridToolbarItem} and its DTO {@link GridToolbarItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface GridToolbarItemMapper extends EntityMapper<GridToolbarItemDTO, GridToolbarItem> {
    @Mapping(target = "gridConfiguration", source = "gridConfiguration", qualifiedByName = "gridConfigurationGridName")
    GridToolbarItemDTO toDto(GridToolbarItem s);

    @Named("gridConfigurationGridName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "gridName", source = "gridName")
    GridConfigurationDTO toDtoGridConfigurationGridName(GridConfiguration gridConfiguration);
}
