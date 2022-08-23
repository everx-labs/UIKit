package tonlabs.uikit.themes;

import android.os.Build.VERSION;
import android.os.Build.VERSION_CODES;

import android.graphics.Color;
import android.view.View;
import android.view.Window;

import androidx.annotation.NonNull;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import org.jetbrains.annotations.NotNull;

@ReactModule(name = UIKitThemesAndroidSystemBarModule.REACT_CLASS)
public class UIKitThemesAndroidSystemBarModule extends ReactContextBaseJavaModule {
    protected static final String REACT_CLASS = "UIKitThemesAndroidSystemBarModule";

    UIKitThemesAndroidSystemBarModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @NotNull
    @Override
    public String getName() {
        return UIKitThemesAndroidSystemBarModule.REACT_CLASS;
    }

    @ReactMethod
    public void setAppearance(String theme) {
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                Window window;

                try {
                    window = getCurrentActivity().getWindow();
                } catch (NullPointerException err) {
                    return;
                }

                View rootView = getCurrentActivity().getWindow().getDecorView().findViewById(android.R.id.content);
                WindowInsetsControllerCompat insetsController = ViewCompat.getWindowInsetsController(rootView);

                if (insetsController == null) {
                    return;
                }

                insetsController.setAppearanceLightNavigationBars("dark-content".equals(theme));
                insetsController.setAppearanceLightStatusBars("dark-content".equals(theme));

                if (VERSION.SDK_INT >= VERSION_CODES.Q) {
                    window.setNavigationBarColor(Color.TRANSPARENT);
                    /**
                     * On Xiaomi there is a border on "dark-content", when a navbar is transparent
                     * Trying to remove it here
                     */
                    if ("xiaomi".equalsIgnoreCase(android.os.Build.MANUFACTURER)) {
                        window.setNavigationBarDividerColor(Color.parseColor("#01000000")); // Almost transparent
                    }

                    return;
                }

                /**
                 * "If you decide to go edge-to-edge on pre-Q devices too,
                 * you should set translucent system bar colors to act as content protection.
                 * A black scrim with 70% opacity is a good place to start for themes with dark system bars..."
                 *
                 * source: https://medium.com/androiddevelopers/gesture-navigation-going-edge-to-edge-812f62e4e83e
                 */
                if (VERSION.SDK_INT >= VERSION_CODES.O_MR1) {
                    if ("dark-content".equals(theme)) {
                        window.setNavigationBarColor(Color.parseColor("#B3FFFFFF"));
                    } else {
                        window.setNavigationBarColor(Color.parseColor("#B3000000"));
                    }

                    return;
                }

                /**
                 * On other version less than 27 (Oreo) set a black scrim background.
                 * It's ugly but there is no much we can do.
                 *
                 * https://medium.com/androiddevelopers/translucent-systembars-the-right-way-across-api-levels-and-themes-6d7ddda21396
                 */
                window.setNavigationBarColor(Color.parseColor("#B3000000"));
            }
        });
    }
}
