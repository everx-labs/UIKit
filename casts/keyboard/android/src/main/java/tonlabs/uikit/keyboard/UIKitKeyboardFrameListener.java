package tonlabs.uikit.keyboard;

import android.app.Activity;
import android.content.Context;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsAnimationCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;

import com.facebook.jni.HybridData;
import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.ReactRootView;

import org.jetbrains.annotations.NotNull;

import java.util.List;

@SuppressWarnings("JniMissingFunction")
public class UIKitKeyboardFrameListener {
    static {
        System.loadLibrary("UIKitKeyboard");
    }

    @Nullable
    static private UIKitKeyboardFrameListener _shared;
    static public UIKitKeyboardFrameListener getShared() {
        if (_shared == null) {
            _shared = new UIKitKeyboardFrameListener();
        }
        return _shared;
    }

    static public void attach(Activity mActivity, ReactRootView rootView) {
        getShared().attachInstance(mActivity, rootView);
    }

    private int paddingBottom = 0;
    @DoNotStrip
    @SuppressWarnings("unused")
    private final HybridData mHybridData;

    private UIKitKeyboardFrameListener() {
        mHybridData = initHybrid();
    }

    private native HybridData initHybrid();
    private native void onBottomChange(double bottom);

    /**
     * This method converts device specific pixels to density independent pixels.
     *
     * @param px A value in px (pixels) unit. Which we need to convert into db
     * @param context Context to get resources and device specific display metrics
     * @return A float value to represent dp equivalent to px value
     */
    public static double convertPixelsToDp(float px, Context context){
        return px / ((double) context.getResources().getDisplayMetrics().densityDpi / DisplayMetrics.DENSITY_DEFAULT);
    }

    private void attachInstance(Activity mActivity, ReactRootView mRootView) {
        ViewCompat.setWindowInsetsAnimationCallback(mRootView, new WindowInsetsAnimationCompat.Callback(WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_STOP) {
            @NonNull
            @NotNull
            @Override
            public WindowInsetsCompat onProgress(@NonNull @NotNull WindowInsetsCompat insets, @NonNull @NotNull List<WindowInsetsAnimationCompat> runningAnimations) {
                Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());

                onBottomChange(convertPixelsToDp(Math.max(ime.bottom - paddingBottom, 0), mActivity));

                return insets;
            }
        });
    }
}
