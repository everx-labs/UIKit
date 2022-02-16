package tonlabs.uikit.scrolls;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactScrollView;

public class UIKitScrollViewInsets extends FrameLayout implements UIKitScrollViewInsetsDelegate {
    private ReactScrollView mScrollView;
    private UIKitScrollViewInsetsSafeArea mScrollViewInsetsSafeArea;
    private UIKitScrollViewInsetsKeyboard mScrollViewInsetsKeyboard;

    private EdgeInsets mContentInset = new EdgeInsets(0,0,0,0);

    public static final String REACT_CLASS = "UIKitScrollViewInsets";

    UIKitScrollViewInsets(@NonNull ThemedReactContext reactContext) {
        super(reactContext);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();

        ViewParent parent = this.getParent();

        if (!(parent instanceof ViewGroup)) {
            return;
        }

        ViewGroup parentGroup = (ViewGroup) parent;

        ReactScrollView scrollView = null;

        for (int i = 0; i < parentGroup.getChildCount(); i += 1) {
            View view = parentGroup.getChildAt(i);

            if (view instanceof ReactScrollView) {
                scrollView = (ReactScrollView) view;
                break;
            }
        }

        if (scrollView == null) {
            return;
        }

        mScrollView = scrollView;
    }

    public void setContentInset(EdgeInsets contentInset) {
        mContentInset = contentInset;
    }

    public void setAutomaticallyAdjustContentInsets(boolean automaticallyAdjustContentInsets) {
        if (!automaticallyAdjustContentInsets) {
            mScrollViewInsetsSafeArea = null;
            return;
        }

        mScrollViewInsetsSafeArea = new UIKitScrollViewInsetsSafeArea(this);
    }

    public void setAutomaticallyAdjustKeyboardInsets(boolean automaticallyAdjustKeyboardInsets) {
        if (!automaticallyAdjustKeyboardInsets) {
            mScrollViewInsetsKeyboard = null;
        }

        mScrollViewInsetsKeyboard = new UIKitScrollViewInsetsKeyboard(this);
    }

    @Override
    public void onInsetsShouldBeRecalculated() {
        EdgeInsets insets = this.mContentInset.copy();

        InsetsChange change = InsetsChange.makeInstant(insets);

        if (mScrollViewInsetsSafeArea != null) {
            change = mScrollViewInsetsSafeArea.calculateInsets(insets);
        }

        if (mScrollViewInsetsKeyboard != null) {
            change = mScrollViewInsetsKeyboard.calculateInsets(change.insets);
        }

        this.applyInsetsChange(change);
    }

    private void applyInsetsChange(InsetsChange change) {
        if (change.animated) {
            // TODO
            return;
        }

        // TODO
//        mScrollView.
    }
}
