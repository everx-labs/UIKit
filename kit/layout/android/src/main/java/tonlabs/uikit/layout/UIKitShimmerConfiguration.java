package tonlabs.uikit.layout;

import android.graphics.Color;

import androidx.annotation.ColorInt;

import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.PixelUtil;

public class UIKitShimmerConfiguration {
    public final float scaledGradientWidth;
    public final float skewDegrees;
    public final int shimmerDuration;
    public final int skeletonDuration;
    public final ShimmerColor backgroundColor;
    public final ShimmerColor accentColor;

    public float physicalSize;
    public float physicalX0;

    static UIKitShimmerConfiguration defaultConfiguration() {
        return new UIKitShimmerConfiguration(
                100.0f,
                10.0f,
                800,
                2000,
                new ShimmerColor(Color.argb(1, 245, 246, 247)),
                new ShimmerColor(Color.argb(1, 237, 238, 241))
        );
    }

    UIKitShimmerConfiguration(
            float scaledGradientWidth,
            float skewDegrees,
            int shimmerDuration,
            int skeletonDuration,
            ShimmerColor backgroundColor,
            ShimmerColor accentColor
    ) {
        this.scaledGradientWidth = PixelUtil.toPixelFromDIP(scaledGradientWidth);
        this.skewDegrees = skewDegrees;
        this.shimmerDuration = shimmerDuration;
        this.skeletonDuration = skeletonDuration;
        this.backgroundColor = backgroundColor;
        this.accentColor = accentColor;

        if (skeletonDuration < shimmerDuration) {
            throw new RuntimeException("Shimmer duration cannot be less than overall skeleton animation");
        }

        initProgressVars();
    }

    private void initProgressVars() {
        float relativeShimmerDuration = ((float) shimmerDuration) / ((float) skeletonDuration);

        float skewTan = (float) Math.tan(skewDegrees * (Math.PI / 180.0f));
        // when we apply a skew to the gradient rect
        // we have to also calculate cathetus of the triangle from the side of it
        // to make a rectangle and use the rectangle width
        float maxSkewGradientWidth = scaledGradientWidth + (DisplayMetricsHolder.getScreenDisplayMetrics().heightPixels * skewTan);

        float screenWidth = DisplayMetricsHolder.getScreenDisplayMetrics().widthPixels;

        physicalSize = (screenWidth + maxSkewGradientWidth) / relativeShimmerDuration;
        physicalX0 = physicalSize / 2 - screenWidth / 2;
    }

    public ProgressCoords getViewProgressCoords(UIKitSkeletonView view) {
        UIKitSkeletonView.ViewPositionRect rect = view.getViewAbsoluteCoords();

        float skewTan = (float) Math.tan(skewDegrees * (Math.PI / 180.0f));
        // when we apply a skew to the gradient rect
        // we have to also calculate cathetus of the triangle from the side of it
        // to make a rectange and use the rectangle witdh
        float skewGradientWidth = scaledGradientWidth + (rect.height * skewTan);
        // calculate cathetus of a triangle that is projected from the bottom of a rect to the upper edge (that is 0)
        float absoluteSkewXProjection = (rect.originY + rect.height) * skewTan;

        float relativeStart = (physicalX0 + rect.originX - skewGradientWidth + absoluteSkewXProjection);
        float start = getRelativeToPhysicalSizeX(relativeStart) / physicalSize;
        float relativeEnd = (physicalX0 + rect.originX + rect.width + absoluteSkewXProjection);
        float end = getRelativeToPhysicalSizeX(relativeEnd) / physicalSize;
        // how much a shimmer gradient rectangle takes compare to a width of a view
        float shift = skewGradientWidth / rect.width;

        return new ProgressCoords(start, end, shift);
    }

    private float getRelativeToPhysicalSizeX(float x) {
        float _x = x;
        while (_x > physicalSize) {
            _x -= physicalSize;
        }
        return _x;
    }

    public static class ShimmerColor {
        float r;
        float g;
        float b;
        float a;

        ShimmerColor(@ColorInt int color) {
            r = Color.red(color) / 255.0f;
            g = Color.green(color) / 255.0f;
            b = Color.blue(color) / 255.0f;
            a = Color.alpha(color) / 255.0f;
        }
    }

    public static class ProgressCoords {
        final float start;
        final float end;
        final float shift;

        ProgressCoords(
                float start,
                float end,
                float shift
        ) {
            this.start = start;
            this.end = end;
            this.shift = shift;
        }
    }
}