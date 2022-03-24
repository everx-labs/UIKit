package tonlabs.uikit.scrolls;

import androidx.annotation.Nullable;
import androidx.core.graphics.Insets;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.events.Event;

public class InsetsChangeEvent extends Event<InsetsChangeEvent> {
    public static final String EVENT_NAME = "topScrollViewInsetsChange";

    private Insets mInsets;

    InsetsChangeEvent(int surfaceId, int viewTag, Insets insets) {
        super(surfaceId, viewTag);

        mInsets = insets;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Nullable
    @org.jetbrains.annotations.Nullable
    @Override
    protected WritableMap getEventData() {
        WritableMap eventData = Arguments.createMap();

        eventData.putDouble("left", PixelUtil.toDIPFromPixel(mInsets.left));
        eventData.putDouble("top", PixelUtil.toDIPFromPixel(mInsets.top));
        eventData.putDouble("right", PixelUtil.toDIPFromPixel(mInsets.right));
        eventData.putDouble("bottom", PixelUtil.toDIPFromPixel(mInsets.bottom));

        return eventData;
    }
}
