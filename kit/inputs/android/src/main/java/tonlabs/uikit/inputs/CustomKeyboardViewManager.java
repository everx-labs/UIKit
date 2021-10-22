package tonlabs.uikit.inputs;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

public class CustomKeyboardViewManager extends ViewGroupManager<CustomKeyboardView> {
    private final CustomKeyboardLayout.Ref mLayoutRef = new CustomKeyboardLayout.Ref();

    public CustomKeyboardViewManager(CustomKeyboardLayout layout) {
        mLayoutRef.set(layout);
    }

    @NonNull
    @Override
    public String getName() {
        return "CustomKeyboardNativeView";
    }

    @NonNull
    @Override
    protected CustomKeyboardView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new CustomKeyboardView(reactContext, mLayoutRef.get());
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        return new CustomKeyboardViewShadowNode(mLayoutRef.get());
    }
}
