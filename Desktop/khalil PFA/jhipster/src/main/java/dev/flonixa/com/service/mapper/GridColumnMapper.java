package dev.flonixa.com.service.mapper;

import dev.flonixa.com.domain.GridColumn;
import dev.flonixa.com.domain.GridConfiguration;
import dev.flonixa.com.service.dto.GridColumnDTO;
import dev.flonixa.com.service.dto.GridConfigurationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GridColumn} and its DTO {@link GridColumnDTO}.
 */
@Mapper(componentModel = "spring")
public interface GridColumnMapper extends EntityMapper<GridColumnDTO, GridColumn> {
    @Mapping(target = "gridConfiguration", source = "gridConfiguration", qualifiedByName = "gridConfigurationGridName")
    GridColumnDTO toDto(GridColumn s);

    @Named("gridConfigurationGridName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "gridName", source = "gridName")
    GridConfigurationDTO toDtoGridConfigurationGridName(GridConfiguration gridConfiguration);
}
