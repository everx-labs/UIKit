package tonlabs.uikit.layout;

import android.graphics.PixelFormat;
import android.util.Log;

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
        UIKitSkeletonView view = UIKitShimmerCoordinator.getSharedCoordinator().createNewView(context);
        return view;
    }

    @Override
    public void onDropViewInstance(@NonNull UIKitSkeletonView view) {
        super.onDropViewInstance(view);

        view.onResume();
        Log.d(REACT_CLASS, String.format("onDropViewInstance: %d", view.getId()));
    }
}
