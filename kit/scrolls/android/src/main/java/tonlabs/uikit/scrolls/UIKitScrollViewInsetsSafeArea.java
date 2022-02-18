package tonlabs.uikit.scrolls;

import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class UIKitScrollViewInsetsSafeArea {
    private final UIKitScrollViewInsetsDelegate mDelegate;

    UIKitScrollViewInsetsSafeArea(UIKitScrollViewInsetsDelegate delegate) {
        mDelegate = delegate;
    }

    public InsetsChange calculateInsets(Insets insetsInChain, WindowInsetsCompat insets) {
        Insets displayCutoutInsets = insets.getInsets(WindowInsetsCompat.Type.displayCutout());
        Insets navigationBarsInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());

        int[] location = new int[2];
        mDelegate.getContainerView().getLocationOnScreen(location);

        int x = location[0];
        int y = location[1];

        Insets safeAreaInsets = Insets.of(
                Math.max(displayCutoutInsets.left - x, 0),
                Math.max(displayCutoutInsets.top - y, 0),
                displayCutoutInsets.right,
                Math.max(displayCutoutInsets.bottom, navigationBarsInsets.bottom)
        );

        return InsetsChange.makeInstant(
                Insets.of(
                        insetsInChain.left + safeAreaInsets.left,
                        insetsInChain.top + safeAreaInsets.top,
                        insetsInChain.right + safeAreaInsets.right,
                        insetsInChain.bottom + safeAreaInsets.bottom
                )
        );
    }
}
