package dev.flonixa.com.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import dev.flonixa.com.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GridColumnDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GridColumnDTO.class);
        GridColumnDTO gridColumnDTO1 = new GridColumnDTO();
        gridColumnDTO1.setId(1L);
        GridColumnDTO gridColumnDTO2 = new GridColumnDTO();
        assertThat(gridColumnDTO1).isNotEqualTo(gridColumnDTO2);
        gridColumnDTO2.setId(gridColumnDTO1.getId());
        assertThat(gridColumnDTO1).isEqualTo(gridColumnDTO2);
        gridColumnDTO2.setId(2L);
        assertThat(gridColumnDTO1).isNotEqualTo(gridColumnDTO2);
        gridColumnDTO1.setId(null);
        assertThat(gridColumnDTO1).isNotEqualTo(gridColumnDTO2);
    }
}
