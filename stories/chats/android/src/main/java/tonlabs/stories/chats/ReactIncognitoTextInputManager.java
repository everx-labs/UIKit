package tonlabs.stories.chats;

import android.text.InputType;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.textinput.ReactTextInputManager;

@ReactModule(name = ReactIncognitoTextInputManager.REACT_CLASS)
public class ReactIncognitoTextInputManager extends ReactTextInputManager {
    protected static final String REACT_CLASS = "AndroidTextInput";

    @Override
    public ReactEditText createViewInstance(ThemedReactContext context) {
        ReactIncognitoEditText editText = new ReactIncognitoEditText(context);
        int inputType = editText.getInputType();
        editText.setInputType(inputType & (~InputType.TYPE_TEXT_FLAG_MULTI_LINE));
        editText.setReturnKeyType("done");
        return editText;
    }

    @ReactProp(name = "noPersonalizedLearning", defaultBoolean = false)
    public void setNoPersonalizedLearning(ReactIncognitoEditText view, boolean noPersonalizedLearning) {
        view.setNoPersonalizedLearning(noPersonalizedLearning);
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }
}
