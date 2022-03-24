package tonlabs.uikit.scrolls;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.views.scroll.ReactScrollView;

@SuppressLint("ViewConstructor")
public class UIKitScrollView extends ReactScrollView implements UIKitScrollViewInsetsDelegate {
    private final ReactContext mReactContext;

    private boolean isAttachedToWindow = false;
    private boolean manageSafeArea = false;
    private boolean manageKeyboard = false;

    private UIKitScrollViewInsetsSafeArea mScrollViewInsetsSafeArea;
    private UIKitScrollViewInsetsKeyboard mScrollViewInsetsKeyboard;

    private String mKeyboardInsetAdjustmentBehavior = "exclusive";

    private Insets mContentInset = Insets.NONE;
    private Insets mPrevInset = Insets.NONE;
    private WindowInsetsCompat mLastKnownWindowInsets;

    UIKitScrollView(@NonNull ThemedReactContext reactContext) {
        super(reactContext);

        mReactContext = reactContext;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();

        if (manageSafeArea) {
            mScrollViewInsetsSafeArea = new UIKitScrollViewInsetsSafeArea(this);
        }

        if (manageKeyboard) {
            mScrollViewInsetsKeyboard = new UIKitScrollViewInsetsKeyboard(this);
        }

        ViewCompat.setOnApplyWindowInsetsListener(this, (v, insets) -> {
            runInsetsChainCalculation(insets);

            mLastKnownWindowInsets = insets;

            return insets;
        });

        isAttachedToWindow = true;
    }

    @Override
    public Activity getCurrentActivity() {
        return mReactContext.getCurrentActivity();
    }

    @Override
    public View getContainerView() {
        return this;
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

    public void setKeyboardInsetAdjustmentBehavior(String keyboardInsetAdjustmentBehavior) {
        mKeyboardInsetAdjustmentBehavior = keyboardInsetAdjustmentBehavior;

        if (mLastKnownWindowInsets == null) {
            return;
        }

        runInsetsChainCalculation(mLastKnownWindowInsets);
    }

    private void runInsetsChainCalculation(WindowInsetsCompat insets) {
        Insets initialInsets = Insets.of(mContentInset.left, mContentInset.top, mContentInset.right, mContentInset.bottom);

        InsetsChange change = InsetsChange.makeInstant(initialInsets);

        if (mScrollViewInsetsSafeArea != null) {
            change = mScrollViewInsetsSafeArea.calculateInsets(change.insets, insets);
        }

        if (mScrollViewInsetsKeyboard != null) {
            change = mScrollViewInsetsKeyboard.calculateInsets(change.insets, initialInsets, insets, mKeyboardInsetAdjustmentBehavior);
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
