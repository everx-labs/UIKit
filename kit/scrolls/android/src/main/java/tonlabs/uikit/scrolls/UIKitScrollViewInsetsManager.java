package tonlabs.uikit.scrolls;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.graphics.Insets;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.jetbrains.annotations.NotNull;

import java.util.Map;

public class UIKitScrollViewInsetsManager extends SimpleViewManager<UIKitScrollViewInsets> {
    @NonNull
    @NotNull
    @Override
    public String getName() {
        return UIKitScrollViewInsets.REACT_CLASS;
    }

    @NonNull
    @NotNull
    @Override
    protected UIKitScrollViewInsets createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new UIKitScrollViewInsets(reactContext);
    }

    @ReactProp(name = "automaticallyAdjustContentInsets")
    public void setAutomaticallyAdjustContentInsets(UIKitScrollViewInsets view, boolean value) {
        view.setAutomaticallyAdjustContentInsets(value);
    }

    @ReactProp(name = "automaticallyAdjustKeyboardInsets")
    public void setAutomaticallyAdjustKeyboardInsets(UIKitScrollViewInsets view, boolean value) {
        view.setAutomaticallyAdjustKeyboardInsets(value);
    }

    @ReactProp(name = "contentInset")
    public void setContentInset(UIKitScrollViewInsets view, ReadableMap contentInsetMap) {
        view.setContentInset(
                Insets.of(
                        contentInsetMap.hasKey("left") ? (int) PixelUtil.toPixelFromDIP(contentInsetMap.getInt("left")) : 0,
                        contentInsetMap.hasKey("top") ? (int) PixelUtil.toPixelFromDIP(contentInsetMap.getInt("top")) : 0,
                        contentInsetMap.hasKey("right") ? (int) PixelUtil.toPixelFromDIP(contentInsetMap.getInt("right")) : 0,
                        contentInsetMap.hasKey("bottom") ? (int) PixelUtil.toPixelFromDIP(contentInsetMap.getInt("bottom")) : 0
                )
        );
    }

    @ReactProp(name = "keyboardInsetAdjustmentBehavior")
    public void setKeyboardInsetAdjustmentBehavior(UIKitScrollViewInsets view, String keyboardInsetAdjustmentBehavior) {
        view.setKeyboardInsetAdjustmentBehavior(keyboardInsetAdjustmentBehavior);
    }

    @Nullable
    @org.jetbrains.annotations.Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        "topScrollViewInsetsChange",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onScrollViewInsetsChange", "captured", "onScrollViewInsetsChangeCapture")))
                .build();
    }
}
