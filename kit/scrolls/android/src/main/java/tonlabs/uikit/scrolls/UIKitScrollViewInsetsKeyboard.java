package tonlabs.uikit.scrolls;

import androidx.core.graphics.Insets;
import androidx.core.view.WindowInsetsCompat;

import com.facebook.react.uimanager.DisplayMetricsHolder;

public class UIKitScrollViewInsetsKeyboard {
    private final UIKitScrollViewInsetsDelegate mDelegate;

    UIKitScrollViewInsetsKeyboard(UIKitScrollViewInsetsDelegate delegate) {
        mDelegate = delegate;
    }

    public InsetsChange calculateInsets(Insets insetsInChain, Insets contentInsets, WindowInsetsCompat insets, String keyboardInsetAdjustmentBehavior) {
        Insets imeInsets = insets.getInsets(WindowInsetsCompat.Type.ime());

        int screenHeight = DisplayMetricsHolder.getScreenDisplayMetrics().heightPixels;

        int[] location = new int[2];
        mDelegate.getContainerView().getLocationOnScreen(location);
        int y = location[1];

        int viewBottomY = y + mDelegate.getContainerView().getHeight();

        int absoluteImeBottomY = screenHeight - imeInsets.bottom;

        Insets keyboardInset = Insets.of(
                imeInsets.left,
                imeInsets.top,
                imeInsets.right,
                Math.min(viewBottomY, screenHeight) - absoluteImeBottomY
        );

        return InsetsChange.makeInstant(
                Insets.of(
                        insetsInChain.left,
                        insetsInChain.top,
                        insetsInChain.right,
                        keyboardInsetAdjustmentBehavior.equals("inclusive")
                                ? Math.max(insetsInChain.bottom, keyboardInset.bottom + contentInsets.bottom)
                                : Math.max(insetsInChain.bottom, keyboardInset.bottom)
                )
        );
    }
}
