package tonlabs.uikit.scrolls;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.graphics.Insets;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.scroll.ReactScrollViewManager;

import org.jetbrains.annotations.NotNull;

import java.util.Map;

@ReactModule(name = UIKitScrollViewManager.REACT_CLASS)
public class UIKitScrollViewManager extends ReactScrollViewManager {
    @NonNull
    @NotNull
    @Override
    public UIKitScrollView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new UIKitScrollView(reactContext);
    }

    @ReactProp(name = "automaticallyAdjustContentInsets")
    public void setAutomaticallyAdjustContentInsets(UIKitScrollView view, boolean value) {
        view.setAutomaticallyAdjustContentInsets(value);
    }

    @ReactProp(name = "automaticallyAdjustKeyboardInsets")
    public void setAutomaticallyAdjustKeyboardInsets(UIKitScrollView view, boolean value) {
        view.setAutomaticallyAdjustKeyboardInsets(value);
    }

    @ReactProp(name = "contentInset")
    public void setContentInset(UIKitScrollView view, ReadableMap contentInsetMap) {
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
    public void setKeyboardInsetAdjustmentBehavior(UIKitScrollView view, String keyboardInsetAdjustmentBehavior) {
        view.setKeyboardInsetAdjustmentBehavior(keyboardInsetAdjustmentBehavior);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        Map<String, Object> constants = super.getExportedCustomDirectEventTypeConstants();

        constants.put(
                InsetsChangeEvent.EVENT_NAME,
                MapBuilder.of(
                        "registrationName",
                        "onInsetsChange")
        );

        return constants;
    }
}
