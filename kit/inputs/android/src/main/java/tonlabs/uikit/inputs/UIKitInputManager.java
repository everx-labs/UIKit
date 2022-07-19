package tonlabs.uikit.inputs;

import com.facebook.react.bridge.ReactApplicationContext;

public class UIKitInputManager {
    static {
        System.loadLibrary("UIKitInputs");
    }

    static public UIKitInputManager getShared(ReactApplicationContext reactApplicationContext) {
        return new UIKitInputManager(reactApplicationContext);
    }

    ReactApplicationContext mReactApplicationContext;
    UIKitInputManager(ReactApplicationContext reactApplicationContext) {
        mReactApplicationContext = reactApplicationContext;
    }

    public UIKitInputBinder bind(int reactTag) {
        return new UIKitInputBinder(mReactApplicationContext, reactTag);
    }
}
