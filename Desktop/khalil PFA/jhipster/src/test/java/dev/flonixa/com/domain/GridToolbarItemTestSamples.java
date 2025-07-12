package dev.flonixa.com.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class GridToolbarItemTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static GridToolbarItem getGridToolbarItemSample1() {
        return new GridToolbarItem()
            .id(1L)
            .location("location1")
            .widget("widget1")
            .icon("icon1")
            .text("text1")
            .hint("hint1")
            .onClickAction("onClickAction1");
    }

    public static GridToolbarItem getGridToolbarItemSample2() {
        return new GridToolbarItem()
            .id(2L)
            .location("location2")
            .widget("widget2")
            .icon("icon2")
            .text("text2")
            .hint("hint2")
            .onClickAction("onClickAction2");
    }

    public static GridToolbarItem getGridToolbarItemRandomSampleGenerator() {
        return new GridToolbarItem()
            .id(longCount.incrementAndGet())
            .location(UUID.randomUUID().toString())
            .widget(UUID.randomUUID().toString())
            .icon(UUID.randomUUID().toString())
            .text(UUID.randomUUID().toString())
            .hint(UUID.randomUUID().toString())
            .onClickAction(UUID.randomUUID().toString());
    }
}
