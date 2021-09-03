package tonlabs.uikit.hydrogen;

import android.widget.ImageView;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import androidx.annotation.Nullable;

@ReactModule(name = HDuplicateImageViewManager.REACT_CLASS)
public class HDuplicateImageViewManager extends SimpleViewManager<ImageView> {
    protected static final String REACT_CLASS = "HDuplicateImageView";
    ReactApplicationContext mCallerContext;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ImageView createViewInstance(ThemedReactContext context) {
        HDuplicateImageView duplicateImageView = new HDuplicateImageView(context, this);
        return duplicateImageView;
    }

    @ReactProp(name = "originalViewRef")
    public void setOriginalViewRef(HDuplicateImageView view, @Nullable int originalViewRef) {
        view.setOriginalViewRef(originalViewRef);
    }
}
