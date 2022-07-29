package tonlabs.uikit;

import androidx.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.TraceUIManagerModule;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

public class TracePackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(createUIManager(reactContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        List<ViewManager> modules = new ArrayList<>();
        return modules;
    }

    private UIManagerModule createUIManager(final ReactApplicationContext reactContext) {
        final ReactInstanceManager reactInstanceManager = getReactInstanceManager(reactContext);
        int minTimeLeftInFrameForNonBatchedOperationMs = -1;

        return new TraceUIManagerModule(
                reactContext,
                reactInstanceManager.getOrCreateViewManagers(reactContext),
                minTimeLeftInFrameForNonBatchedOperationMs);
    }

    public ReactInstanceManager getReactInstanceManager(ReactApplicationContext reactContext) {
        return ((ReactApplication) reactContext.getApplicationContext())
                .getReactNativeHost()
                .getReactInstanceManager();
    }
}
