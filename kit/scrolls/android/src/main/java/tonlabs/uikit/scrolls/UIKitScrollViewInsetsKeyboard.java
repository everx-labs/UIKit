package tonlabs.uikit.scrolls;

import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class UIKitScrollViewInsetsKeyboard {
    private UIKitScrollViewInsetsDelegate mDelegate;
    private Insets mLastKnownImeInsets = Insets.NONE;

    UIKitScrollViewInsetsKeyboard(UIKitScrollViewInsetsDelegate delegate, View view) {
        mDelegate = delegate;

        ViewCompat.setOnApplyWindowInsetsListener(view, new OnApplyWindowInsetsListener() {
            @Override
            public WindowInsetsCompat onApplyWindowInsets(View view, WindowInsetsCompat insets) {
                mLastKnownImeInsets = insets.getInsets(WindowInsetsCompat.Type.ime());

                mDelegate.onInsetsShouldBeRecalculated();

                return insets;
            }
        });
    }

    public InsetsChange calculateInsets(Insets insets) {
        return InsetsChange.makeInstant(
                Insets.of(
                        insets.left,
                        insets.top,
                        insets.right,
                        Math.max(insets.bottom, mLastKnownImeInsets.bottom)
                )
        );
    }
}
