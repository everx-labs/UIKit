package tonlabs.uikit.hydrogen;

import android.widget.ImageView;
import androidx.annotation.NonNull;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = HDuplicateImageViewManager.REACT_CLASS)
public class HDuplicateImageViewManager extends SimpleViewManager<ImageView> {

    protected static final String REACT_CLASS = "HDuplicateImageView";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    public ImageView createViewInstance(@NonNull ThemedReactContext context) {
        return new HDuplicateImageView(context);
    }

    @ReactProp(name = "originalViewRef")
    public void setOriginalViewRef(HDuplicateImageView view, int originalViewRef) {
        view.setOriginalViewRef(originalViewRef);
    }
}
