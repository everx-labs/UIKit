package tonlabs.uikit.inputs;

import android.text.Editable;
import android.text.InputFilter;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;

import androidx.annotation.Nullable;

import com.facebook.jni.HybridData;
import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.text.ReactTextUpdate;
import com.facebook.react.views.text.ReactTextView;
import com.facebook.react.views.textinput.ReactEditText;

import org.jetbrains.annotations.NotNull;

public class UIKitInputManager {
    static {
        System.loadLibrary("UIKitInputs");
    }

    static public String TAG = "UIKitInputManager";

    @Nullable
    static private UIKitInputManager _shared;

    static public UIKitInputManager getShared(ReactApplicationContext reactApplicationContext) {
        if (_shared == null) {
            _shared = new UIKitInputManager(reactApplicationContext);
        }
        return _shared;
    }

    ReactApplicationContext mReactApplicationContext;
    UIKitInputManager(ReactApplicationContext reactApplicationContext) {
        mReactApplicationContext = reactApplicationContext;
    }

    public UIKitInputBinder bind(int reactTag) {
        return new UIKitInputBinder(mReactApplicationContext, reactTag);
    }
}
