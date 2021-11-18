package tonlabs.uikit;

import androidx.annotation.NonNull;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactScrollView;
import com.facebook.react.views.scroll.ReactScrollViewManager;

import org.jetbrains.annotations.NotNull;


@ReactModule(name = ReactOverScrollViewManager.REACT_CLASS)
public class ReactOverScrollViewManager extends ReactScrollViewManager {
    public static final String REACT_CLASS = "RCTScrollView";

    @NonNull
    @NotNull
    @Override
    public ReactScrollView createViewInstance(ThemedReactContext reactContext) {
        return new ReactOverScrollView(reactContext);
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }
}
