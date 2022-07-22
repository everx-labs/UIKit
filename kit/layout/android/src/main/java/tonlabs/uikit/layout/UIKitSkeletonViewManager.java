package tonlabs.uikit.layout;

import androidx.annotation.NonNull;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

@ReactModule(name = UIKitSkeletonViewManager.REACT_CLASS)
public class UIKitSkeletonViewManager extends SimpleViewManager<UIKitSkeletonView> {
    protected static final String REACT_CLASS = "UIKitSkeletonView";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    public UIKitSkeletonView createViewInstance(@NonNull ThemedReactContext context) {
        return new UIKitSkeletonView(context, new UIKitShimmerRenderer(context));
    }
}
