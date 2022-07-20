package tonlabs.uikit.inputs;

import com.facebook.react.bridge.ReactApplicationContext;

public class UIKitInputController {
    static {
        System.loadLibrary("UIKitInputs");
    }

    static public UIKitInputController getShared(ReactApplicationContext reactApplicationContext) {
        return new UIKitInputController(reactApplicationContext);
    }

    ReactApplicationContext mReactApplicationContext;
    UIKitInputController(ReactApplicationContext reactApplicationContext) {
        mReactApplicationContext = reactApplicationContext;
    }

    public UIKitInputBinder bind(int reactTag) {
        return new UIKitInputBinder(mReactApplicationContext, reactTag);
    }
}
