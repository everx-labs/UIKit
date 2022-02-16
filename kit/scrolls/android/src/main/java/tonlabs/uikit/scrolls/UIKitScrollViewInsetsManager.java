package tonlabs.uikit.scrolls;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.jetbrains.annotations.NotNull;

public class UIKitScrollViewInsetsManager extends BaseViewManager<UIKitScrollViewInsets, LayoutShadowNode> {
    @NonNull
    @NotNull
    @Override
    public String getName() {
        return UIKitScrollViewInsets.REACT_CLASS;
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        return new LayoutShadowNode();
    }

    @Override
    public Class<? extends LayoutShadowNode> getShadowNodeClass() {
        return LayoutShadowNode.class;
    }

    @Override
    public void updateExtraData(@NonNull @NotNull UIKitScrollViewInsets root, Object extraData) {
        //
    }

    @NonNull
    @NotNull
    @Override
    protected UIKitScrollViewInsets createViewInstance(ThemedReactContext reactContext) {
        return new UIKitScrollViewInsets(reactContext);
    }

    @ReactProp(name = "automaticallyAdjustContentInsets", defaultBoolean = false)
    public void setAutomaticallyAdjustContentInsets(UIKitScrollViewInsets view, boolean value) {
        view.setAutomaticallyAdjustContentInsets(value);
    }

    @ReactProp(name = "automaticallyAdjustKeyboardInsets", defaultBoolean = false)
    public void setAutomaticallyAdjustKeyboardInsets(UIKitScrollViewInsets view, boolean value) {
        view.setAutomaticallyAdjustKeyboardInsets(value);
    }

    @ReactProp(name = "contentInset")
    public void setContentInset(UIKitScrollViewInsets view, ReadableMap contentInsetMap) {
        view.setContentInset(
                new EdgeInsets(
                        contentInsetMap.hasKey("top") ? contentInsetMap.getInt("top") : 0,
                        contentInsetMap.hasKey("right") ? contentInsetMap.getInt("right") : 0,
                        contentInsetMap.hasKey("bottom") ? contentInsetMap.getInt("bottom") : 0,
                        contentInsetMap.hasKey("left") ? contentInsetMap.getInt("left") : 0
                )
        );
    }
}
