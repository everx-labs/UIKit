package tonlabs.uikit.inputs;

import android.util.Log;

import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;

import java.util.Arrays;
import java.util.List;

@SuppressWarnings("JniMissingFunction")
public class UIKitInputManagerJSIModulePackage implements JSIModulePackage {
//    static {
//        System.loadLibrary("UIKitInputsModule");
//    }
    public static final String TAG = "UIKitInputManagerJSI";
    static {
        try {
            System.loadLibrary("UIKitInputManager");
            Log.d(TAG, "-------- UIKitInputManager-cpp: loaded");
        } catch (Exception e){
            Log.d(TAG, "-------- UIKitInputManager-cpp: not loaded");
            e.printStackTrace();
        }
    }

    public static native void installJSIBindings(long jsiPtr, CallInvokerHolderImpl jsCallInvokerHelper, UIKitInputManager uiKitInputManager);

    public static void install(ReactApplicationContext reactApplicationContext) {
        long jsiPtr = reactApplicationContext.getJavaScriptContextHolder().get();
        CallInvokerHolderImpl jsCallInvokerHolder = (CallInvokerHolderImpl) reactApplicationContext.getCatalystInstance().getJSCallInvokerHolder();

        UIKitInputManagerJSIModulePackage.installJSIBindings(jsiPtr, jsCallInvokerHolder, UIKitInputManager.getShared());
    }

    @Override
    public List<JSIModuleSpec> getJSIModules(ReactApplicationContext reactApplicationContext, JavaScriptContextHolder jsContext) {
        // No-op

        return Arrays.<JSIModuleSpec>asList();
    }
}
