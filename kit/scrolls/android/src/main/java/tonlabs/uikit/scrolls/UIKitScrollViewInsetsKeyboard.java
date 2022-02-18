package tonlabs.uikit.scrolls;

import android.util.DisplayMetrics;

import androidx.core.graphics.Insets;
import androidx.core.view.WindowInsetsCompat;

public class UIKitScrollViewInsetsKeyboard {
    private final UIKitScrollViewInsetsDelegate mDelegate;

    UIKitScrollViewInsetsKeyboard(UIKitScrollViewInsetsDelegate delegate) {
        mDelegate = delegate;
    }

    public InsetsChange calculateInsets(Insets insetsInChain, WindowInsetsCompat insets) {
        Insets imeInsets = insets.getInsets(WindowInsetsCompat.Type.ime());

        DisplayMetrics displayMetrics = new DisplayMetrics();
        mDelegate.getCurrentActivity().getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        int screenHeight = displayMetrics.heightPixels;

        int[] location = new int[2];
        mDelegate.getContainerView().getLocationOnScreen(location);
        int y = location[1];

        int viewBottomY = y + mDelegate.getContainerView().getHeight();

        int absoluteImeBottom = screenHeight - imeInsets.bottom;

        Insets keyboardInset = Insets.of(
                imeInsets.left,
                imeInsets.top,
                imeInsets.right,
                Math.min(viewBottomY, screenHeight) - absoluteImeBottom
        );

        return InsetsChange.makeInstant(
                Insets.of(
                        insetsInChain.left,
                        insetsInChain.top,
                        insetsInChain.right,
                        Math.max(insetsInChain.bottom, keyboardInset.bottom)
                )
        );
    }
}
