package tonlabs.uikit.inputs;

import android.text.Editable;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.IllegalViewOperationException;
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
    private final int mReactTag;

    UIKitInputBinder(ReactApplicationContext reactApplicationContext, int reactTag) {
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
        View view = null;
        try {
            view = mUiManagerModule.resolveView(reactTag);
        } catch (IllegalViewOperationException e) {
            e.printStackTrace();
        }

        if (view instanceof ReactEditText) {
            return (ReactEditText) view;
        } else return null;
    }

    private void applyText(@NonNull ReactEditText reactEditText, String value) {
        Editable editableText = reactEditText.getEditableText();
        editableText.replace(0, editableText.length(), value);
    }

    private void moveCaret(@NonNull ReactEditText reactEditText, int caretPosition) {
        reactEditText.setSelection(caretPosition);
    }

    @SuppressWarnings("unused")
    public void setText(String value, int caretPosition) {
        /*
        There are situations when the call to setText occurs before the execution
        of the resolveView method on runOnUiQueueThread completes.
        Therefore, we have to execute the resolveView method here explicitly.
         */
        if (mReactEditText == null) {
            mReactApplicationContext.runOnUiQueueThread(
                () -> {
                    if (mReactEditText == null) {
                        mReactEditText = resolveView(mReactTag);
                    }
                    if (mReactEditText != null) {
                        applyText(mReactEditText, value);
                        moveCaret(mReactEditText, caretPosition);
                    }
                }
            );
        } else {
            applyText(mReactEditText, value);
            moveCaret(mReactEditText, caretPosition);
        }
    }
}
