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
    static {
        System.loadLibrary("UIKitInputs");
    }

    static void log(String value) {
        Log.d("UIKitInputManagerJSI", value);
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
