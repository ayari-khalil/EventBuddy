package dev.flonixa.com.domain;

import static dev.flonixa.com.domain.GridColumnTestSamples.*;
import static dev.flonixa.com.domain.GridConfigurationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import dev.flonixa.com.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GridColumnTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GridColumn.class);
        GridColumn gridColumn1 = getGridColumnSample1();
        GridColumn gridColumn2 = new GridColumn();
        assertThat(gridColumn1).isNotEqualTo(gridColumn2);

        gridColumn2.setId(gridColumn1.getId());
        assertThat(gridColumn1).isEqualTo(gridColumn2);

        gridColumn2 = getGridColumnSample2();
        assertThat(gridColumn1).isNotEqualTo(gridColumn2);
    }

    @Test
    void gridConfigurationTest() {
        GridColumn gridColumn = getGridColumnRandomSampleGenerator();
        GridConfiguration gridConfigurationBack = getGridConfigurationRandomSampleGenerator();

        gridColumn.setGridConfiguration(gridConfigurationBack);
        assertThat(gridColumn.getGridConfiguration()).isEqualTo(gridConfigurationBack);

        gridColumn.gridConfiguration(null);
        assertThat(gridColumn.getGridConfiguration()).isNull();
    }
}
