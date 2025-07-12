package dev.flonixa.com.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class GridColumnTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static GridColumn getGridColumnSample1() {
        return new GridColumn().id(1L).dataField("dataField1").caption("caption1").dataType("dataType1").format("format1").width(1);
    }

    public static GridColumn getGridColumnSample2() {
        return new GridColumn().id(2L).dataField("dataField2").caption("caption2").dataType("dataType2").format("format2").width(2);
    }

    public static GridColumn getGridColumnRandomSampleGenerator() {
        return new GridColumn()
            .id(longCount.incrementAndGet())
            .dataField(UUID.randomUUID().toString())
            .caption(UUID.randomUUID().toString())
            .dataType(UUID.randomUUID().toString())
            .format(UUID.randomUUID().toString())
            .width(intCount.incrementAndGet());
    }
}
