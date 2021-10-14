package tonlabs.uikit.inputs;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;

import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIManagerModule;

import java.lang.ref.WeakReference;

public class CustomKeyboardLayout implements SoftKeyboardMonitor.Listener, ScreenMonitor.Listener {

    private final SoftKeyboardMonitor mKeyboardMonitor;
    private final InputMethodManager mInputMethodManager;
    private final ReactApplicationContext mReactContext;
    private WeakReference<CustomKeyboardViewShadowNode> mShadowNode = new WeakReference<>(null);

    public CustomKeyboardLayout(ReactApplicationContext reactContext, SoftKeyboardMonitor keyboardMonitor, ScreenMonitor screenMonitor) {
        mReactContext = reactContext;
        mKeyboardMonitor = keyboardMonitor;
        mInputMethodManager = (InputMethodManager) reactContext.getSystemService(Context.INPUT_METHOD_SERVICE);

        mKeyboardMonitor.setListener(this);
        screenMonitor.addListener(this);
    }

    @Override
    public void onSoftKeyboardVisible(boolean distinct) {
        if (distinct) {
            clearKeyboardOverlayMode();
        }
    }

    @Override
    public void onSoftKeyboardHidden() {

    }

    @Override
    public void onNewReactScreen(ReactRootView reactRootView) {
        clearKeyboardOverlayMode();
    }

    public void setShadowNode(CustomKeyboardViewShadowNode node) {
        mShadowNode = new WeakReference<>(node);
    }

    public void showCustomContent() {
        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                setKeyboardOverlayMode();
                showCustomKeyboardContent();
                hideSoftKeyboardIfNeeded();
            }
        });
    }

    public void forceReset() {
        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                hideCustomKeyboardContent();
                clearKeyboardOverlayMode();
            }
        });
    }

    private void clearKeyboardOverlayMode() {
        Window window = AppContextHolder.getWindow();

        if (window != null) {
            window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        }
    }

    private void setKeyboardOverlayMode() {
        Window window = AppContextHolder.getWindow();

        if (window != null) {
            window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        }
    }

    private void showCustomKeyboardContent() {
        setCustomKeyboardHeight(getHeightForCustomContent());
    }

    private void hideCustomKeyboardContent() {
        setCustomKeyboardHeight(0);
    }

    private void setCustomKeyboardHeight(int height) {
        try {
            syncCustomKeyboardHeightAfterUIUpdate(height);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void syncCustomKeyboardHeightAfterUIUpdate(final int height) {
        mReactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                setShadowNodeHeight(height);
                mReactContext.runOnNativeModulesQueueThread(new Runnable() {
                    @Override
                    public void run() {
                        mReactContext.getNativeModule(UIManagerModule.class).onBatchComplete();
                    }
                });
            }
        });
    }

    private void setShadowNodeHeight(int height) {
        final CustomKeyboardViewShadowNode node = mShadowNode.get();
        if (node != null) {
            node.setHeight(height);
        }
    }

    private int getHeightForCustomContent() {
        Integer height = mKeyboardMonitor.getKeyboardHeight();

        if (height == null) {
            return 0;
        }

        return height;
    }

    private void hideSoftKeyboardIfNeeded() {
        Activity activity = AppContextHolder.getCurrentActivity();

        if (activity == null) {
            return;
        }

        final View focusedView = activity.getCurrentFocus();

        if (focusedView != null) {
            mInputMethodManager.hideSoftInputFromWindow(focusedView.getWindowToken(), 0);
        }
    }

    public static class Ref {
        private CustomKeyboardLayout mInstance = null;

        public void set(CustomKeyboardLayout instance) {
            mInstance = instance;
        }

        public CustomKeyboardLayout get() {
            return mInstance;
        }
    }
}
