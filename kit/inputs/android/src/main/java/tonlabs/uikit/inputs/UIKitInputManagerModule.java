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
//        installJSIBindings();
    }

    @NotNull
    @Override
    public String getName() {
        return UIKitInputManagerModule.REACT_CLASS;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void install() {
        UIKitInputManagerJSIModulePackage.install(getReactApplicationContext());
    }

    // @ReactMethod(isBlockingSynchronousMethod = true)
    // public void init() {
    //     // When debugging in chrome the JS context is not available.
    //     // https://github.com/facebook/react-native/blob/v0.67.0-rc.6/ReactAndroid/src/main/java/com/facebook/react/modules/blob/BlobCollector.java#L25
    //     Boolean isChromeDebugger = getReactApplicationContext().getJavaScriptContextHolder().get() == 0;

    //     if (!isChromeDebugger) {
    //         this.getNodesManager().initWithContext(getReactApplicationContext());
    //     } else {
    //     Log.w(
    //         "[UIKitInputManagerModule]",
    //         "Unable to create UIKit Input Manager Module. You can ignore this message if you are using Chrome Debugger now.");
    //     }
    // }

//    @ReactMethod(isBlockingSynchronousMethod = true)
//    public void injectInputValue(int originalViewRef, String value) {
////        UIKitInputManagerModule.install(getReactApplicationContext());
//        System.out.println("originalViewRef: " + originalViewRef);
//        System.out.println("value: " + value);
//    }
}
