package tonlabs.uikit.keyboard;

import android.graphics.Rect;
import android.view.ViewTreeObserver;
import android.view.Window;

import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactApplicationContext;

import javax.annotation.Nullable;

public class SoftKeyboardMonitor implements ScreenMonitor.Listener {

    public interface Listener {
        void onSoftKeyboardVisible(boolean distinct);
        void onSoftKeyboardHidden();
    }

    private final ViewTreeObserver.OnGlobalLayoutListener mInnerLayoutListener = new ViewTreeObserver.OnGlobalLayoutListener() {
        @Override
        public void onGlobalLayout() {
            Integer viewportVisibleHeight = getViewportVisibleHeight();

            if (viewportVisibleHeight == null || viewportVisibleHeight.equals(mLastViewportVisibleHeight)) {
                return;
            }

            mLastViewportVisibleHeight = viewportVisibleHeight;

            if (mMaxViewportVisibleHeight == null) {
                mMaxViewportVisibleHeight = viewportVisibleHeight;
            } else if (viewportVisibleHeight < mMaxViewportVisibleHeight) {
                mExternalListener.onSoftKeyboardVisible(!mSoftKeyboardUp);
                refreshKeyboardHeight();
                mSoftKeyboardUp = true;
            } else {
                mSoftKeyboardUp = false;
                mExternalListener.onSoftKeyboardHidden();
            }
        }
    };

    /**
     * Soft-keyboard appearance (yes or no) is deduced according to <b>view-port</b> (window-level display-frame), as
     * root-view height normally remains unaffected during immediate layout. We therefore keep the maximal view-port size so we could
     * concurrently compare heights in each layout.
     */
    private Integer mMaxViewportVisibleHeight;

    private Integer mLastViewportVisibleHeight;

    /**
     * Soft-keyboard *height* (when visible) is deduced by the effect on the root react-view height. This is ineffective in trying to
     * monitor keyboard appearance -- only for height measuring.
     */
    private Integer mLocallyVisibleHeight;

    private boolean mSoftKeyboardUp;
    private Integer mKeyboardHeight;
    private Listener mExternalListener;
    private ReactRootView mLastReactRootView;

    private ReactApplicationContext mReactContext;

    public SoftKeyboardMonitor(ScreenMonitor screenMonitor, ReactApplicationContext reactContext) {
        mReactContext = reactContext;
        screenMonitor.addListener(this);
    }

    @Override
    public void onNewReactScreen(ReactRootView reactRootView) {
        removeReactRootViewLayoutListener();
        mLastReactRootView = reactRootView;

        // 'Null' is applicable when activity is going down (e.g. bundle reload in RN dev mode)
        if (mLastReactRootView != null) {
            registerReactRootViewLayoutListener();

            initViewportVisibleHeight();
            initLocallyVisibleHeight();
        }
    }

    public void setListener(Listener listener) {
        mExternalListener = listener;
    }

    @Nullable
    public Integer getKeyboardHeight() {
        if (mKeyboardHeight != null) {
            return mKeyboardHeight;
        }

        if (mLocallyVisibleHeight != null) {
            return (int) (.5f * mLocallyVisibleHeight);
        }

        return null;
    }

    private Integer getViewportVisibleHeight() {
        Integer visibleHeight = null;
        final Rect visibleArea = new Rect();
        Window window = AppContextHolder.getWindow();

        if (window != null) {
            window.getDecorView().getWindowVisibleDisplayFrame(visibleArea);

            visibleHeight = visibleArea.height();
        }

        return visibleHeight;
    }

    private Integer getLocallyVisibleHeight() {
        if (mLastReactRootView != null) {
            return mLastReactRootView.getHeight();
        }

        return null;
    }

    private void refreshKeyboardHeight() {
        if (mKeyboardHeight != null) {
            // TODO: why it might be uninitialized?
            return;
        }

        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                final Integer locallyVisibleHeight = getLocallyVisibleHeight();

                if (locallyVisibleHeight == null) {
                    // Too late to join the party - react-view seems to be gone...
                    return;
                }

                if (mLocallyVisibleHeight == null) {
                    mLocallyVisibleHeight = locallyVisibleHeight;
                    mKeyboardHeight = locallyVisibleHeight;
                } else if (mLocallyVisibleHeight > locallyVisibleHeight) {
                    mKeyboardHeight = mLocallyVisibleHeight - locallyVisibleHeight;
                } else {
                    mKeyboardHeight = locallyVisibleHeight;
                }
            }
        });
    }

    private void registerReactRootViewLayoutListener() {
        final ViewTreeObserver viewTreeObserver = mLastReactRootView.getViewTreeObserver();
        viewTreeObserver.addOnGlobalLayoutListener(mInnerLayoutListener);
    }

    private void removeReactRootViewLayoutListener() {
        if (mLastReactRootView != null) {
            final ViewTreeObserver viewTreeObserver = mLastReactRootView.getViewTreeObserver();
            viewTreeObserver.removeOnGlobalLayoutListener(mInnerLayoutListener);
        }
    }

    private void initViewportVisibleHeight() {
        mMaxViewportVisibleHeight = getViewportVisibleHeight();
        mLastViewportVisibleHeight = null;
    }

    private void initLocallyVisibleHeight() {
        mLocallyVisibleHeight = getLocallyVisibleHeight();
        // Reset so the keyboard would be measured in the next opportunity.
        mKeyboardHeight = null;
    }
}
