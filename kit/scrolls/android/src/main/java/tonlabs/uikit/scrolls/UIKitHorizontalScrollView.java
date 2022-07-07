package tonlabs.uikit.scrolls;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactHorizontalScrollView;

public class UIKitHorizontalScrollView extends ReactHorizontalScrollView {
    private boolean mFlingEnabled = true;

    UIKitHorizontalScrollView(@NonNull ThemedReactContext reactContext) {
        super(reactContext);
    }

    void setFlingEnabled(boolean enabled) {
        mFlingEnabled = enabled;
    }

    @Override
    public void fling(int velocityX) {
        if (!mFlingEnabled) {
            return;
        }
        super.fling(velocityX);
    }
}
