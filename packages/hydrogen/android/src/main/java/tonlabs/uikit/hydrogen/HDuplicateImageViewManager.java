package tonlabs.uikit.hydrogen;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.image.ReactImageManager;
import com.facebook.react.views.image.ReactImageView;

import androidx.annotation.Nullable;

@ReactModule(name = HDuplicateImageViewManager.REACT_CLASS)
public class HDuplicateImageViewManager extends ReactImageManager {
    protected static final String REACT_CLASS = "HDuplicateImageView";
    ReactApplicationContext mCallerContext;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ReactImageView createViewInstance(ThemedReactContext context) {
        HDuplicateImageView duplicateImageView = new HDuplicateImageView(
                context,
                Fresco.newDraweeControllerBuilder(),
                null,
                mCallerContext
        );
        return duplicateImageView;
    }

    @ReactProp(name = "originalViewRef")
    public void setOriginalViewRef(HDuplicateImageView view, @Nullable int originalViewRef) {
        view.setOriginalViewRef(originalViewRef);
    }
}
