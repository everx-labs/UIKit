package tonlabs.uikit.scrolls;

import androidx.core.graphics.Insets;
import androidx.core.view.WindowInsetsCompat;

import com.facebook.react.uimanager.DisplayMetricsHolder;

public class UIKitScrollViewInsetsSafeArea {
    private final UIKitScrollViewInsetsDelegate mDelegate;

    UIKitScrollViewInsetsSafeArea(UIKitScrollViewInsetsDelegate delegate) {
        mDelegate = delegate;
    }

    public InsetsChange calculateInsets(Insets insetsInChain, WindowInsetsCompat insets) {
        Insets displayCutoutInsets = insets.getInsets(WindowInsetsCompat.Type.displayCutout());
        Insets navigationBarsInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());

        int screenHeight = DisplayMetricsHolder.getScreenDisplayMetrics().heightPixels;

        int[] location = new int[2];
        mDelegate.getContainerView().getLocationOnScreen(location);
        int x = location[0];
        int y = location[1];

        int viewBottomY = y + mDelegate.getContainerView().getHeight();

        int bottomInset = Math.max(displayCutoutInsets.bottom, navigationBarsInsets.bottom);

        int absoluteSafeBottomY = screenHeight - bottomInset;

        Insets safeAreaInsets = Insets.of(
                Math.max(displayCutoutInsets.left - x, 0),
                Math.max(displayCutoutInsets.top - y, 0),
                displayCutoutInsets.right,
                Math.min(viewBottomY, screenHeight) - absoluteSafeBottomY
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
