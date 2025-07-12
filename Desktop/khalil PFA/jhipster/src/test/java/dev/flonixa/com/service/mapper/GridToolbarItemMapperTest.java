package dev.flonixa.com.service.mapper;

import static dev.flonixa.com.domain.GridToolbarItemAsserts.*;
import static dev.flonixa.com.domain.GridToolbarItemTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GridToolbarItemMapperTest {

    private GridToolbarItemMapper gridToolbarItemMapper;

    @BeforeEach
    void setUp() {
        gridToolbarItemMapper = new GridToolbarItemMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getGridToolbarItemSample1();
        var actual = gridToolbarItemMapper.toEntity(gridToolbarItemMapper.toDto(expected));
        assertGridToolbarItemAllPropertiesEquals(expected, actual);
    }
}
