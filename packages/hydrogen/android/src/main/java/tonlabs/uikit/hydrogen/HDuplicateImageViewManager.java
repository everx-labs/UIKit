package tonlabs.uikit.hydrogen;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.image.ReactImageManager;
import com.facebook.react.views.image.ReactImageView;

@ReactModule(name = HDuplicateImageViewManager.REACT_CLASS)
public class HDuplicateImageViewManager extends ReactImageManager {
    protected static final String REACT_CLASS = "HDuplicateImageView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ReactImageView createViewInstance(ThemedReactContext context) {
        HDuplicateImageView duplicateImageView = new HDuplicateImageView(
                context,
                this.getDraweeControllerBuilder(),
                null,
                null
        );
        return duplicateImageView;
    }

    @ReactProp(name = "originalViewRef")
    public void setOriginalViewRef(HDuplicateImageView view, int originalViewRef) {
        view.setOriginalViewRef(originalViewRef);
    }
}
