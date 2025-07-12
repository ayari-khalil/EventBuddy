package dev.flonixa.com.service.mapper;

import dev.flonixa.com.domain.GridConfiguration;
import dev.flonixa.com.service.dto.GridConfigurationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GridConfiguration} and its DTO {@link GridConfigurationDTO}.
 */
@Mapper(componentModel = "spring")
public interface GridConfigurationMapper extends EntityMapper<GridConfigurationDTO, GridConfiguration> {}
