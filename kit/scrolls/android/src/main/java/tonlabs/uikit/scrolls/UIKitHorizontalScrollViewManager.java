package tonlabs.uikit.scrolls;

import androidx.annotation.NonNull;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.scroll.ReactHorizontalScrollViewManager;

import org.jetbrains.annotations.NotNull;

@ReactModule(name = UIKitHorizontalScrollViewManager.REACT_CLASS)
public class UIKitHorizontalScrollViewManager extends ReactHorizontalScrollViewManager {
    @NonNull
    @NotNull
    @Override
    public UIKitHorizontalScrollView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new UIKitHorizontalScrollView(reactContext);
    }

    @ReactProp(name = "flingEnabled")
    public void setFlingEnabled(UIKitHorizontalScrollView view, boolean value) {
        view.setFlingEnabled(value);
    }
}
