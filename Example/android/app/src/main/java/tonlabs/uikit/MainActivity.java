package tonlabs.uikit;

import androidx.core.view.WindowCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import tonlabs.uikit.keyboard.UIKitKeyboardFrameListener;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "UIKit";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                RNGestureHandlerEnabledRootView rootView = new RNGestureHandlerEnabledRootView(MainActivity.this);

                WindowCompat.setDecorFitsSystemWindows(MainActivity.this.getWindow(), false);
                UIKitKeyboardFrameListener.attach(MainActivity.this, rootView);

                return rootView;
            }
        };
    }
}
