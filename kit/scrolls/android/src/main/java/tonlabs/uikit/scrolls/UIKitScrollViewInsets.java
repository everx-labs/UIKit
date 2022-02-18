package tonlabs.uikit.scrolls;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.ReactScrollView;
import com.facebook.react.uimanager.UIManagerHelper;

@SuppressLint("ViewConstructor")
public class UIKitScrollViewInsets extends FrameLayout implements UIKitScrollViewInsetsDelegate {
    private ReactScrollView mScrollView;
    private final ReactContext mReactContext;

    private boolean isAttachedToWindow = false;
    private boolean manageSafeArea = false;
    private boolean manageKeyboard = false;

    private UIKitScrollViewInsetsSafeArea mScrollViewInsetsSafeArea;
    private UIKitScrollViewInsetsKeyboard mScrollViewInsetsKeyboard;

    private Insets mContentInset = Insets.NONE;
    private Insets mPrevInset = Insets.NONE;
    private WindowInsetsCompat mLastKnownWindowInsets;

    public static final String REACT_CLASS = "UIKitScrollViewInsets";

    UIKitScrollViewInsets(@NonNull ThemedReactContext reactContext) {
        super(reactContext);

        mReactContext = reactContext;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();

        mScrollView = getManagedReactScrollView();

        if (mScrollView == null) {
            return;
        }

        if (manageSafeArea) {
            mScrollViewInsetsSafeArea = new UIKitScrollViewInsetsSafeArea(this);
        }

        if (manageKeyboard) {
            mScrollViewInsetsKeyboard = new UIKitScrollViewInsetsKeyboard(this);
        }

        ViewCompat.setOnApplyWindowInsetsListener(getContainerView(), (v, insets) -> {
            runInsetsChainCalculation(insets);

            mLastKnownWindowInsets = insets;

            return insets;
        });

        isAttachedToWindow = true;
    }

    private ReactScrollView getManagedReactScrollView() {
        ViewParent parent = this.getParent();

        if (!(parent instanceof ViewGroup)) {
            return null;
        }

        ViewGroup parentGroup = (ViewGroup) parent;

        for (int i = 0; i < parentGroup.getChildCount(); i += 1) {
            View view = parentGroup.getChildAt(i);

            if (view instanceof ReactScrollView) {
                return (ReactScrollView) view;
            }
        }

        return null;
    }

    public void setContentInset(Insets contentInset) {
        mContentInset = contentInset;

        if (mLastKnownWindowInsets == null) {
            return;
        }

        runInsetsChainCalculation(mLastKnownWindowInsets);
    }

    public void setAutomaticallyAdjustContentInsets(boolean automaticallyAdjustContentInsets) {
        if (!isAttachedToWindow) {
            manageSafeArea = automaticallyAdjustContentInsets;
            return;
        }

        if (!automaticallyAdjustContentInsets) {
            mScrollViewInsetsSafeArea = null;
            return;
        }

        mScrollViewInsetsSafeArea = new UIKitScrollViewInsetsSafeArea(this);
    }

    public void setAutomaticallyAdjustKeyboardInsets(boolean automaticallyAdjustKeyboardInsets) {
        if (!isAttachedToWindow) {
            manageKeyboard = automaticallyAdjustKeyboardInsets;
            return;
        }

        if (!automaticallyAdjustKeyboardInsets) {
            mScrollViewInsetsKeyboard = null;
        }

        mScrollViewInsetsKeyboard = new UIKitScrollViewInsetsKeyboard(this);
    }

    @Override
    public Activity getCurrentActivity() {
        return mReactContext.getCurrentActivity();
    }

    @Override
    public View getContainerView() {
        return mScrollView == null ? this : mScrollView;
    }

    private void runInsetsChainCalculation(WindowInsetsCompat insets) {
        Insets initialInsets = Insets.of(mContentInset.left, mContentInset.top, mContentInset.right, mContentInset.bottom);

        InsetsChange change = InsetsChange.makeInstant(initialInsets);

        if (mScrollViewInsetsSafeArea != null) {
            change = mScrollViewInsetsSafeArea.calculateInsets(change.insets, insets);
        }

        if (mScrollViewInsetsKeyboard != null) {
            change = mScrollViewInsetsKeyboard.calculateInsets(change.insets, insets);
        }

        applyInsetsChange(change);
    }

    private void applyInsetsChange(InsetsChange change) {
        if (change.animated) {
            // TODO
            // it isn't used for now anyway,
            // just leave it for future improvements
            return;
        }

        if (change.insets.equals(mPrevInset)) {
            return;
        }

        mPrevInset = change.insets;

        UIManagerHelper.getEventDispatcherForReactTag(mReactContext, getId()).dispatchEvent(
            new InsetsChangeEvent(UIManagerHelper.getSurfaceId(mReactContext), getId(), change.insets)
        );
    }
}
