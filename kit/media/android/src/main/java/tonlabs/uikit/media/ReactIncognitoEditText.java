package tonlabs.uikit.media;

import android.content.Context;
import android.os.Build;
import android.view.inputmethod.EditorInfo;

import com.facebook.react.views.textinput.ReactEditText;

import javax.annotation.Nullable;

public class ReactIncognitoEditText extends ReactEditText {
    private @Nullable boolean mDisableFullscreen = false;
    private @Nullable boolean mNoPersonalizedLearning = false;
    private @Nullable String mReturnKeyType;

    public ReactIncognitoEditText(Context context) {
        super(context);
    }

    private void updateImeOptions() {
        int options = EditorInfo.IME_ACTION_DONE;
        if (mReturnKeyType != null) {
            switch (mReturnKeyType) {
                case "go":
                    options = EditorInfo.IME_ACTION_GO;
                    break;
                case "next":
                    options = EditorInfo.IME_ACTION_NEXT;
                    break;
                case "none":
                    options = EditorInfo.IME_ACTION_NONE;
                    break;
                case "previous":
                    options = EditorInfo.IME_ACTION_PREVIOUS;
                    break;
                case "search":
                    options = EditorInfo.IME_ACTION_SEARCH;
                    break;
                case "send":
                    options = EditorInfo.IME_ACTION_SEND;
                    break;
                case "done":
                    options = EditorInfo.IME_ACTION_DONE;
                    break;
            }
        }

        if (mDisableFullscreen) {
            options = options | EditorInfo.IME_FLAG_NO_FULLSCREEN;
        }
        if (mNoPersonalizedLearning && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            options = options | EditorInfo.IME_FLAG_NO_PERSONALIZED_LEARNING;
        }
        setImeOptions(options);
    }

    public void setNoPersonalizedLearning(boolean noPersonalizedLearning) {
        mNoPersonalizedLearning = noPersonalizedLearning;
        updateImeOptions();
    }


    @Override
    public void setDisableFullscreenUI(boolean disableFullscreenUI) {
        mDisableFullscreen = disableFullscreenUI;
        updateImeOptions();
    }

    @Override
    public void setReturnKeyType(String returnKeyType) {
        mReturnKeyType = returnKeyType;
        updateImeOptions();
    }
}
