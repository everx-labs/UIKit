package tonlabs.uikit.inputs;

import android.text.Editable;
import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.textinput.ReactEditText;

public class UIKitInputBinder {
    static {
        System.loadLibrary("UIKitInputs");
    }
    private final ReactApplicationContext mReactApplicationContext;
    private final UIManagerModule mUiManagerModule;
    @Nullable
    private ReactEditText mReactEditText;

    UIKitInputBinder(ReactApplicationContext reactApplicationContext, int reactTag) {
        mReactApplicationContext = reactApplicationContext;
        mUiManagerModule = reactApplicationContext.getNativeModule(UIManagerModule.class);

        resolveView(reactTag);
    }

    private void resolveView(int reactTag) {
        mReactApplicationContext.runOnUiQueueThread(
                () -> {
                    if (mUiManagerModule == null) {
                        return;
                    }

                    View view = mUiManagerModule.resolveView(reactTag);
                    if (view instanceof ReactEditText) {
                        mReactEditText = (ReactEditText) view;
                    }
                }
        );
    }

    public void setText(String value) {
        if (mReactEditText == null) {
            return;
        }
        Editable editableText = mReactEditText.getEditableText();
        editableText.replace(0, editableText.length(), value);
    }
}
