package dev.flonixa.com.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import dev.flonixa.com.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GridToolbarItemDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GridToolbarItemDTO.class);
        GridToolbarItemDTO gridToolbarItemDTO1 = new GridToolbarItemDTO();
        gridToolbarItemDTO1.setId(1L);
        GridToolbarItemDTO gridToolbarItemDTO2 = new GridToolbarItemDTO();
        assertThat(gridToolbarItemDTO1).isNotEqualTo(gridToolbarItemDTO2);
        gridToolbarItemDTO2.setId(gridToolbarItemDTO1.getId());
        assertThat(gridToolbarItemDTO1).isEqualTo(gridToolbarItemDTO2);
        gridToolbarItemDTO2.setId(2L);
        assertThat(gridToolbarItemDTO1).isNotEqualTo(gridToolbarItemDTO2);
        gridToolbarItemDTO1.setId(null);
        assertThat(gridToolbarItemDTO1).isNotEqualTo(gridToolbarItemDTO2);
    }
}
