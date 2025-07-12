package dev.flonixa.com.service.mapper;

import static dev.flonixa.com.domain.GridColumnAsserts.*;
import static dev.flonixa.com.domain.GridColumnTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GridColumnMapperTest {

    private GridColumnMapper gridColumnMapper;

    @BeforeEach
    void setUp() {
        gridColumnMapper = new GridColumnMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getGridColumnSample1();
        var actual = gridColumnMapper.toEntity(gridColumnMapper.toDto(expected));
        assertGridColumnAllPropertiesEquals(expected, actual);
    }
}
