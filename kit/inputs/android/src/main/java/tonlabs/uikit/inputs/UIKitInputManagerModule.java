package tonlabs.uikit.inputs;

//import androidx.annotation.NonNull;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.NotNull;

@ReactModule(name = UIKitInputManagerModule.REACT_CLASS)
public class UIKitInputManagerModule extends ReactContextBaseJavaModule {
    protected static final String REACT_CLASS = "UIKitInputManagerModule";

    UIKitInputManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NotNull
    @Override
    public String getName() {
        return UIKitInputManagerModule.REACT_CLASS;
    }
}
