package tonlabs.uikit.inputs;

//import androidx.annotation.NonNull;
import android.text.SpannableStringBuilder;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;

import androidx.annotation.Nullable;

import com.facebook.jni.HybridData;
import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.text.ReactTextUpdate;
import com.facebook.react.views.text.ReactTextView;
import com.facebook.react.views.textinput.ReactEditText;

import org.jetbrains.annotations.NotNull;

public class UIKitInputManager {
    static {
        System.loadLibrary("UIKitInputs");
    }

    static public String TAG = "UIKitInputManager";

    @Nullable
    static private UIKitInputManager _shared;


    static public UIKitInputManager getShared(ReactApplicationContext reactApplicationContext) {
        if (_shared == null) {
            _shared = new UIKitInputManager(reactApplicationContext);
        }
        return _shared;
    }

    ReactApplicationContext _reactApplicationContext;
    UIManagerModule _uiManagerModule;
    UIKitInputManager(ReactApplicationContext reactApplicationContext) {
        _reactApplicationContext = reactApplicationContext;
        _uiManagerModule = reactApplicationContext.getNativeModule(UIManagerModule.class);
    }
//    @DoNotStrip
//    @SuppressWarnings("unused")
//    private final HybridData mHybridData;
//    private native HybridData initHybrid();
//Dup
//    private UIKitInputManager() {
//        mHybridData = initHybrid();
//    }


    public void injectInputValue(int originalViewRef, String value) {
//        UIKitInputManagerModule.install(getReactApplicationContext());

        Log.d("UIKitInputManager", "injectInputValue" + value + originalViewRef);

        _reactApplicationContext.runOnUiQueueThread(
                () -> {
                    if (_uiManagerModule == null) {
                        return;
                    }

                    View originalView = _uiManagerModule.resolveView(originalViewRef);
                    if (originalView instanceof ReactEditText) {
                        ReactEditText reactEditText = (ReactEditText) originalView;
                        SpannableStringBuilder sb = new SpannableStringBuilder(value);
                        ReactTextUpdate reactTextUpdate = new ReactTextUpdate(
                                sb,
                                reactEditText.incrementAndGetEventCounter(),
                                false,
                                0,
                                0,
                                0,
                                0,
                                Gravity.NO_GRAVITY,
                                0,
                                0,
                                0,
                                value.length()
                        );
                        reactEditText.maybeSetText(reactTextUpdate);
                    }
                }
        );
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
