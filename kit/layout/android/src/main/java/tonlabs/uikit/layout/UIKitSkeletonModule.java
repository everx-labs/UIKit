package tonlabs.uikit.layout;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.PixelUtil;

@ReactModule(name = UIKitSkeletonModule.REACT_CLASS)
public class UIKitSkeletonModule extends ReactContextBaseJavaModule {
    protected static final String REACT_CLASS = "UIKitSkeletonModule";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void configure(ReadableMap newConfig) {
        UIKitShimmerConfiguration defaultConfig = UIKitShimmerConfiguration.defaultConfiguration();

        float gradientWidth = PixelUtil.toDIPFromPixel(defaultConfig.scaledGradientWidth);
        float skewDegrees = defaultConfig.skewDegrees;
        int shimmerDuration = defaultConfig.shimmerDuration;
        int skeletonDuration = defaultConfig.skeletonDuration;
        UIKitShimmerConfiguration.ShimmerColor backgroundColor = defaultConfig.backgroundColor;
        UIKitShimmerConfiguration.ShimmerColor accentColor = defaultConfig.accentColor;

        if (newConfig.hasKey("gradientWidth")) {
            gradientWidth = (float) newConfig.getDouble("gradientWidth");
        }
        if (newConfig.hasKey("skewDegrees")) {
            skewDegrees = (float) newConfig.getDouble("skewDegrees");
        }
        if (newConfig.hasKey("shimmerDuration")) {
            shimmerDuration = newConfig.getInt("shimmerDuration");
        }
        if (newConfig.hasKey("skeletonDuration")) {
            skeletonDuration = newConfig.getInt("skeletonDuration");
        }
        if (newConfig.hasKey("backgroundColor")) {
            backgroundColor = new UIKitShimmerConfiguration.ShimmerColor(newConfig.getInt("backgroundColor"));
        }
        if (newConfig.hasKey("accentColor")) {
            accentColor = new UIKitShimmerConfiguration.ShimmerColor(newConfig.getInt("accentColor"));
        }

        UIKitShimmerConfiguration config = new UIKitShimmerConfiguration(
                gradientWidth,
                skewDegrees,
                shimmerDuration,
                skeletonDuration,
                backgroundColor,
                accentColor
        );

        UIKitShimmerCoordinator.getSharedCoordinator().updateConfiguration(config);
    }
}
