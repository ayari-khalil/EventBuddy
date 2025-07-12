package dev.flonixa.com.service.mapper;

import static dev.flonixa.com.domain.GridConfigurationAsserts.*;
import static dev.flonixa.com.domain.GridConfigurationTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GridConfigurationMapperTest {

    private GridConfigurationMapper gridConfigurationMapper;

    @BeforeEach
    void setUp() {
        gridConfigurationMapper = new GridConfigurationMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getGridConfigurationSample1();
        var actual = gridConfigurationMapper.toEntity(gridConfigurationMapper.toDto(expected));
        assertGridConfigurationAllPropertiesEquals(expected, actual);
    }
}
