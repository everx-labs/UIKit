package tonlabs.uikit.keyboard;

import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;

import java.util.Arrays;
import java.util.List;

@SuppressWarnings("JniMissingFunction")
public class UIKitKeyboardJSIModulePackage implements JSIModulePackage {
    static {
        System.loadLibrary("UIKitKeyboard");
    }

    public static native void installJSIBindings(long jsiPtr, CallInvokerHolderImpl jsCallInvokerHelper, UIKitKeyboardFrameListener androidFrameListener);

    @Override
    public List<JSIModuleSpec> getJSIModules(ReactApplicationContext reactApplicationContext, JavaScriptContextHolder jsContext) {
        long jsiPtr = reactApplicationContext.getJavaScriptContextHolder().get();
        CallInvokerHolderImpl jsCallInvokerHolder = (CallInvokerHolderImpl) reactApplicationContext.getCatalystInstance().getJSCallInvokerHolder();

        UIKitKeyboardJSIModulePackage.installJSIBindings(jsiPtr, jsCallInvokerHolder, UIKitKeyboardFrameListener.getShared());

        return Arrays.<JSIModuleSpec>asList();
    }
}
