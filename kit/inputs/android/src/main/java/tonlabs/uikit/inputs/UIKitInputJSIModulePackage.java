package tonlabs.uikit.inputs;

import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;

import java.util.Arrays;
import java.util.List;

@SuppressWarnings("JniMissingFunction")
public class UIKitInputJSIModulePackage implements JSIModulePackage {
    static {
        System.loadLibrary("UIKitInputs");
    }

    public static native void installJSIBindings(long jsiPtr, CallInvokerHolderImpl jsCallInvokerHelper, UIKitInputBinder uiKitInputBinder);

    public static void install(ReactApplicationContext reactApplicationContext) {;
        long jsiPtr = reactApplicationContext.getJavaScriptContextHolder().get();
        CallInvokerHolderImpl jsCallInvokerHolder = (CallInvokerHolderImpl) reactApplicationContext.getCatalystInstance().getJSCallInvokerHolder();

        UIKitInputJSIModulePackage.installJSIBindings(jsiPtr, jsCallInvokerHolder, UIKitInputBinder.getShared(reactApplicationContext));
    }

    @Override
    public List<JSIModuleSpec> getJSIModules(ReactApplicationContext reactApplicationContext, JavaScriptContextHolder jsContext) {
        // No-op

        return Arrays.<JSIModuleSpec>asList();
    }
}
