package tonlabs.uikit.scrolls;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.graphics.Insets;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
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
                        contentInsetMap.hasKey("left") ? contentInsetMap.getInt("left") : 0,
                        contentInsetMap.hasKey("top") ? contentInsetMap.getInt("top") : 0,
                        contentInsetMap.hasKey("right") ? contentInsetMap.getInt("right") : 0,
                        contentInsetMap.hasKey("bottom") ? contentInsetMap.getInt("bottom") : 0
                )
        );
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
