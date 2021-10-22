package tonlabs.uikit.inputs;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

public class CustomKeyboardView extends FrameLayout {
    private final CustomKeyboardLayout.Ref mLayoutRef = new CustomKeyboardLayout.Ref();

    public CustomKeyboardView(@NonNull Context context, CustomKeyboardLayout layout) {
        super(context);
        mLayoutRef.set(layout);

        setWillNotDraw(false);
    }

    @Override
    public void onViewAdded(View child) {
        if (getChildCount() == 1) {
            mLayoutRef.get().showCustomContent();
        }
        super.onViewAdded(child);
    }

    @Override
    public void onViewRemoved(View child) {
        if (getChildCount() == 0) {
            mLayoutRef.get().forceReset();
        }
        super.onViewRemoved(child);
    }
}
