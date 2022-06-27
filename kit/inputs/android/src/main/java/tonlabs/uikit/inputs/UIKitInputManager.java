package tonlabs.uikit.inputs;

//import androidx.annotation.NonNull;
import android.util.Log;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.NotNull;

public class UIKitInputManager {
//    static {
//        System.loadLibrary("UIKitInputsModule");
//    }


//    UIKitInputManager(ReactApplicationContext reactContext) {
//        super(reactContext);
//    }

    @Nullable
    static private UIKitInputManager _shared;
    static public UIKitInputManager getShared() {
        if (_shared == null) {
            _shared = new UIKitInputManager();
        }
        return _shared;
    }


    public void injectInputValue(int originalViewRef, String value) {
//        UIKitInputManagerModule.install(getReactApplicationContext());
        Log.d("UIKitInputManager", "injectInputValue");
//        System.out.println("originalViewRef: " + originalViewRef);
//        System.out.println("value: " + value);
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

}
