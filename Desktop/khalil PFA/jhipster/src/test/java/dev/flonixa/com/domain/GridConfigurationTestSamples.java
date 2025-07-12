package dev.flonixa.com.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class GridConfigurationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static GridConfiguration getGridConfigurationSample1() {
        return new GridConfiguration()
            .id(1L)
            .gridName("gridName1")
            .pageSize(1)
            .pagerAllowedPageSizes("pagerAllowedPageSizes1")
            .sortingMode("sortingMode1")
            .searchPanelWidth(1)
            .searchPanelPlaceholder("searchPanelPlaceholder1")
            .exportFileName("exportFileName1")
            .selectionMode("selectionMode1")
            .selectionShowCheckBoxesMode("selectionShowCheckBoxesMode1")
            .editingMode("editingMode1");
    }

    public static GridConfiguration getGridConfigurationSample2() {
        return new GridConfiguration()
            .id(2L)
            .gridName("gridName2")
            .pageSize(2)
            .pagerAllowedPageSizes("pagerAllowedPageSizes2")
            .sortingMode("sortingMode2")
            .searchPanelWidth(2)
            .searchPanelPlaceholder("searchPanelPlaceholder2")
            .exportFileName("exportFileName2")
            .selectionMode("selectionMode2")
            .selectionShowCheckBoxesMode("selectionShowCheckBoxesMode2")
            .editingMode("editingMode2");
    }

    public static GridConfiguration getGridConfigurationRandomSampleGenerator() {
        return new GridConfiguration()
            .id(longCount.incrementAndGet())
            .gridName(UUID.randomUUID().toString())
            .pageSize(intCount.incrementAndGet())
            .pagerAllowedPageSizes(UUID.randomUUID().toString())
            .sortingMode(UUID.randomUUID().toString())
            .searchPanelWidth(intCount.incrementAndGet())
            .searchPanelPlaceholder(UUID.randomUUID().toString())
            .exportFileName(UUID.randomUUID().toString())
            .selectionMode(UUID.randomUUID().toString())
            .selectionShowCheckBoxesMode(UUID.randomUUID().toString())
            .editingMode(UUID.randomUUID().toString());
    }
}
