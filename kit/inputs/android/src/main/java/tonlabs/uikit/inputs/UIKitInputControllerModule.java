package tonlabs.uikit.inputs;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.NotNull;

@ReactModule(name = UIKitInputControllerModule.REACT_CLASS)
public class UIKitInputControllerModule extends ReactContextBaseJavaModule {
    protected static final String REACT_CLASS = "UIKitInputControllerModule";

    UIKitInputControllerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NotNull
    @Override
    public String getName() {
        return UIKitInputControllerModule.REACT_CLASS;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void install() {
        UIKitInputControllerJSIModulePackage.install(getReactApplicationContext());
    }

}
