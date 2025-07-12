package dev.flonixa.com.domain;

import static dev.flonixa.com.domain.GridConfigurationTestSamples.*;
import static dev.flonixa.com.domain.GridToolbarItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import dev.flonixa.com.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GridToolbarItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GridToolbarItem.class);
        GridToolbarItem gridToolbarItem1 = getGridToolbarItemSample1();
        GridToolbarItem gridToolbarItem2 = new GridToolbarItem();
        assertThat(gridToolbarItem1).isNotEqualTo(gridToolbarItem2);

        gridToolbarItem2.setId(gridToolbarItem1.getId());
        assertThat(gridToolbarItem1).isEqualTo(gridToolbarItem2);

        gridToolbarItem2 = getGridToolbarItemSample2();
        assertThat(gridToolbarItem1).isNotEqualTo(gridToolbarItem2);
    }

    @Test
    void gridConfigurationTest() {
        GridToolbarItem gridToolbarItem = getGridToolbarItemRandomSampleGenerator();
        GridConfiguration gridConfigurationBack = getGridConfigurationRandomSampleGenerator();

        gridToolbarItem.setGridConfiguration(gridConfigurationBack);
        assertThat(gridToolbarItem.getGridConfiguration()).isEqualTo(gridConfigurationBack);

        gridToolbarItem.gridConfiguration(null);
        assertThat(gridToolbarItem.getGridConfiguration()).isNull();
    }
}
