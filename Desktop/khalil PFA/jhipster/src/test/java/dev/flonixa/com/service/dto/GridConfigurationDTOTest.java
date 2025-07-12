package dev.flonixa.com.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import dev.flonixa.com.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GridConfigurationDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GridConfigurationDTO.class);
        GridConfigurationDTO gridConfigurationDTO1 = new GridConfigurationDTO();
        gridConfigurationDTO1.setId(1L);
        GridConfigurationDTO gridConfigurationDTO2 = new GridConfigurationDTO();
        assertThat(gridConfigurationDTO1).isNotEqualTo(gridConfigurationDTO2);
        gridConfigurationDTO2.setId(gridConfigurationDTO1.getId());
        assertThat(gridConfigurationDTO1).isEqualTo(gridConfigurationDTO2);
        gridConfigurationDTO2.setId(2L);
        assertThat(gridConfigurationDTO1).isNotEqualTo(gridConfigurationDTO2);
        gridConfigurationDTO1.setId(null);
        assertThat(gridConfigurationDTO1).isNotEqualTo(gridConfigurationDTO2);
    }
}
