package tonlabs.uikit.keyboard;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.List;

public class KeyboardPackage implements ReactPackage {
    private CustomKeyboardLayout.Ref mLayoutRef = new CustomKeyboardLayout.Ref();

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new UIKitKeyboardFrameListenerModule(reactContext));
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        init(reactContext);

        return Arrays.<ViewManager>asList(new CustomKeyboardViewManager(mLayoutRef.get()));
    }

    private synchronized void init(ReactApplicationContext context) {
        AppContextHolder.init(context);

        final ScreenMonitor screenMonitor = new ScreenMonitor(context);
        final SoftKeyboardMonitor keyboardMonitor = new SoftKeyboardMonitor(screenMonitor, context);

        mLayoutRef.set(new CustomKeyboardLayout(context, keyboardMonitor, screenMonitor));
    }
}