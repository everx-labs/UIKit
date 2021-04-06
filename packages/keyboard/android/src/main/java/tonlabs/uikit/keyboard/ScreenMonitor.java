package tonlabs.uikit.keyboard;

import android.view.ViewTreeObserver;
import android.view.Window;

import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;

import java.util.HashSet;
import java.util.Set;

public class ScreenMonitor implements LifecycleEventListener {

    public interface Listener {
        void onNewReactScreen(ReactRootView reactRootView);
    }

    private final ViewTreeObserver.OnGlobalLayoutListener mWindowLayoutListener = new ViewTreeObserver.OnGlobalLayoutListener() {
        @Override
        public void onGlobalLayout() {
            final ReactRootView reactRootView = AppContextHolder.getReactRootView();
            if (mLastReactRootView != reactRootView) {
                mLastReactRootView = reactRootView;
                notifyNewScreen();
            }
        }
    };

    private ReactRootView mLastReactRootView;
    private Set<Listener> mExternalListeners = new HashSet<>();

    private boolean mHasWindowLayoutListener;

    public ScreenMonitor(ReactContext reactContext) {
        reactContext.addLifecycleEventListener(this);
    }

    public void addListener(Listener listener) {
        mExternalListeners.add(listener);
    }

    @Override
    public void onHostResume() {
        if (mHasWindowLayoutListener) {
            removeWindowLayoutListener();
        }
        mHasWindowLayoutListener = true;
        registerWindowLayoutListener();
    }

    @Override
    public void onHostDestroy() {
        removeWindowLayoutListener();
        mHasWindowLayoutListener = false;
    }

    @Override
    public void onHostPause() {
    }

    private void registerWindowLayoutListener() {
        Window window = AppContextHolder.getWindow();

        if (window == null) {
            return;
        }

        window.getDecorView().getViewTreeObserver().addOnGlobalLayoutListener(mWindowLayoutListener);
    }

    private void removeWindowLayoutListener() {
        Window window = AppContextHolder.getWindow();
        if (window == null) {
            // No window => no activity => nothing to clear.
            return;
        }

        window.getDecorView().getViewTreeObserver().removeOnGlobalLayoutListener(mWindowLayoutListener);
    }

    private void notifyNewScreen() {
        for (Listener listener : mExternalListeners) {
            listener.onNewReactScreen(mLastReactRootView);
        }
    }
}
