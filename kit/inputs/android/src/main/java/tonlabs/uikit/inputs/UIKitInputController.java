package tonlabs.uikit.inputs;

import android.text.Editable;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.textinput.ReactEditText;

public class UIKitInputController {
    static {
        System.loadLibrary("UIKitInputs");
    }
    private final ReactApplicationContext mReactApplicationContext;
    private final UIManagerModule mUiManagerModule;
    @Nullable
    private ReactEditText mReactEditText;
    private final int mReactTag;

    UIKitInputController(ReactApplicationContext reactApplicationContext, int reactTag) {
        mReactApplicationContext = reactApplicationContext;
        mUiManagerModule = reactApplicationContext.getNativeModule(UIManagerModule.class);
        mReactTag = reactTag;

        mReactApplicationContext.runOnUiQueueThread(() -> {
            if (mReactEditText == null) {
                mReactEditText = resolveView(reactTag);
            }
        });
    }

    @Nullable
    private ReactEditText resolveView(int reactTag) {
        if (mUiManagerModule == null) {
            return null;
        }

        try {
            View view = mUiManagerModule.resolveView(reactTag);
            if (view instanceof ReactEditText) {
                return (ReactEditText) view;
            }
        } catch (IllegalViewOperationException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void setText(@NonNull ReactEditText reactEditText, String value) {
        @Nullable Editable editableText = reactEditText.getText();
        if (editableText != null) {
            editableText.replace(0, editableText.length(), value);
        }
    }

    private void moveCaret(@NonNull ReactEditText reactEditText, int caretPosition) {
        reactEditText.setSelection(caretPosition);
    }

    @SuppressWarnings("unused")
    public void setTextAndCaretPosition(String value, int caretPosition) {
        /*
        `resolveView` must be called inside the `runOnUiQueueThread` to find the view.

        We change text in `runOnUiQueueThread`, otherwise `StringIndexOutOfBoundsException`
        is thrown on deleting characters when changes happen fast enough.
        */
        mReactApplicationContext.runOnUiQueueThread(
            () -> {
                if (mReactEditText == null) {
                    mReactEditText = resolveView(mReactTag);
                }
                if (mReactEditText != null) {
                    setText(mReactEditText, value);
                    moveCaret(mReactEditText, caretPosition);
                }
            }
        );
    }
}
