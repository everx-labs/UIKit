package tonlabs.uikit.inputs;

import com.facebook.react.bridge.ReactApplicationContext;

public class UIKitInputBinder {
    static {
        System.loadLibrary("UIKitInputs");
    }

    static public UIKitInputBinder getShared(ReactApplicationContext reactApplicationContext) {
        return new UIKitInputBinder(reactApplicationContext);
    }

    ReactApplicationContext mReactApplicationContext;
    UIKitInputBinder(ReactApplicationContext reactApplicationContext) {
        mReactApplicationContext = reactApplicationContext;
    }

    public UIKitInputController bind(int reactTag) {
        return new UIKitInputController(mReactApplicationContext, reactTag);
    }
}
