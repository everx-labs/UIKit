package tonlabs.uikit.keyboard;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.NotNull;

@ReactModule(name = UIKitKeyboardFrameListenerModule.REACT_CLASS)
public class UIKitKeyboardFrameListenerModule extends ReactContextBaseJavaModule {
    protected static final String REACT_CLASS = "UIKitKeyboardFrameListenerModule";

    UIKitKeyboardFrameListenerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @NotNull
    @Override
    public String getName() {
        return UIKitKeyboardFrameListenerModule.REACT_CLASS;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void install() {
        UIKitKeyboardJSIModulePackage.install(getReactApplicationContext());
    }
}
