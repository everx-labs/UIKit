package tonlabs.uikit.inputs;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.NotNull;

@ReactModule(name = UIKitInputModule.REACT_CLASS)
public class UIKitInputModule extends ReactContextBaseJavaModule {
    protected static final String REACT_CLASS = "UIKitInputModule";

    UIKitInputModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NotNull
    @Override
    public String getName() {
        return UIKitInputModule.REACT_CLASS;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void install() {
        UIKitInputJSIModulePackage.install(getReactApplicationContext());
    }

}
