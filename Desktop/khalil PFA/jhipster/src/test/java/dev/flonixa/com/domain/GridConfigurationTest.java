package dev.flonixa.com.domain;

import static dev.flonixa.com.domain.GridColumnTestSamples.*;
import static dev.flonixa.com.domain.GridConfigurationTestSamples.*;
import static dev.flonixa.com.domain.GridToolbarItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import dev.flonixa.com.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GridConfigurationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GridConfiguration.class);
        GridConfiguration gridConfiguration1 = getGridConfigurationSample1();
        GridConfiguration gridConfiguration2 = new GridConfiguration();
        assertThat(gridConfiguration1).isNotEqualTo(gridConfiguration2);

        gridConfiguration2.setId(gridConfiguration1.getId());
        assertThat(gridConfiguration1).isEqualTo(gridConfiguration2);

        gridConfiguration2 = getGridConfigurationSample2();
        assertThat(gridConfiguration1).isNotEqualTo(gridConfiguration2);
    }

    @Test
    void columnsTest() {
        GridConfiguration gridConfiguration = getGridConfigurationRandomSampleGenerator();
        GridColumn gridColumnBack = getGridColumnRandomSampleGenerator();

        gridConfiguration.addColumns(gridColumnBack);
        assertThat(gridConfiguration.getColumns()).containsOnly(gridColumnBack);
        assertThat(gridColumnBack.getGridConfiguration()).isEqualTo(gridConfiguration);

        gridConfiguration.removeColumns(gridColumnBack);
        assertThat(gridConfiguration.getColumns()).doesNotContain(gridColumnBack);
        assertThat(gridColumnBack.getGridConfiguration()).isNull();

        gridConfiguration.columns(new HashSet<>(Set.of(gridColumnBack)));
        assertThat(gridConfiguration.getColumns()).containsOnly(gridColumnBack);
        assertThat(gridColumnBack.getGridConfiguration()).isEqualTo(gridConfiguration);

        gridConfiguration.setColumns(new HashSet<>());
        assertThat(gridConfiguration.getColumns()).doesNotContain(gridColumnBack);
        assertThat(gridColumnBack.getGridConfiguration()).isNull();
    }

    @Test
    void toolbarItemsTest() {
        GridConfiguration gridConfiguration = getGridConfigurationRandomSampleGenerator();
        GridToolbarItem gridToolbarItemBack = getGridToolbarItemRandomSampleGenerator();

        gridConfiguration.addToolbarItems(gridToolbarItemBack);
        assertThat(gridConfiguration.getToolbarItems()).containsOnly(gridToolbarItemBack);
        assertThat(gridToolbarItemBack.getGridConfiguration()).isEqualTo(gridConfiguration);

        gridConfiguration.removeToolbarItems(gridToolbarItemBack);
        assertThat(gridConfiguration.getToolbarItems()).doesNotContain(gridToolbarItemBack);
        assertThat(gridToolbarItemBack.getGridConfiguration()).isNull();

        gridConfiguration.toolbarItems(new HashSet<>(Set.of(gridToolbarItemBack)));
        assertThat(gridConfiguration.getToolbarItems()).containsOnly(gridToolbarItemBack);
        assertThat(gridToolbarItemBack.getGridConfiguration()).isEqualTo(gridConfiguration);

        gridConfiguration.setToolbarItems(new HashSet<>());
        assertThat(gridConfiguration.getToolbarItems()).doesNotContain(gridToolbarItemBack);
        assertThat(gridToolbarItemBack.getGridConfiguration()).isNull();
    }
}
