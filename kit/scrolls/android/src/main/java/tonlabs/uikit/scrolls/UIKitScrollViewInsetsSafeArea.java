package tonlabs.uikit.scrolls;

import android.util.Log;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class UIKitScrollViewInsetsSafeArea {
    private UIKitScrollViewInsetsDelegate mDelegate;
    private Insets mLastKnownSafeAreaInsets = Insets.NONE;

    UIKitScrollViewInsetsSafeArea(UIKitScrollViewInsetsDelegate delegate, View view) {
        mDelegate = delegate;

        ViewCompat.setOnApplyWindowInsetsListener(view, new OnApplyWindowInsetsListener() {
            @Override
            public WindowInsetsCompat onApplyWindowInsets(View view, WindowInsetsCompat insets) {
                Insets displayCutoutInsets = insets.getInsets(WindowInsetsCompat.Type.displayCutout());
                Insets navigationBarsInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());

                int[] location = new int[2];
                view.getLocationOnScreen(location);

                int x = location[0];
                int y = location[1];

                mLastKnownSafeAreaInsets = Insets.of(
                        Math.max(displayCutoutInsets.left - x, 0),
                        Math.max(displayCutoutInsets.top - y, 0),
                        displayCutoutInsets.right,
                        Math.max(displayCutoutInsets.bottom, navigationBarsInsets.bottom)
                );

                Log.d("UIKitScrollViewInsetsSafeArea", mLastKnownSafeAreaInsets.toString());


                mDelegate.onInsetsShouldBeRecalculated();

                return insets;
            }
        });
    }

    public InsetsChange calculateInsets(Insets insets) {
        return InsetsChange.makeInstant(
                Insets.of(
                        insets.left + mLastKnownSafeAreaInsets.left,
                        insets.top + mLastKnownSafeAreaInsets.top,
                        insets.right + mLastKnownSafeAreaInsets.right,
                        insets.bottom + mLastKnownSafeAreaInsets.bottom
                )
        );
    }
}
