package tonlabs.uikit.layout;

import android.annotation.SuppressLint;
import android.opengl.GLSurfaceView;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ThemedReactContext;

/**
 * TODO: must implement onPause and onResume!
 */
@SuppressLint("ViewConstructor")
public class UIKitSkeletonView extends GLSurfaceView implements UIKitShimmerRenderer.ShimmerProgress {
    private UIKitShimmerRenderer.ProgressCoords mProgressCoords;
    private boolean mNeedFirstRender = true;
    private boolean mLastShouldRenderCheck = false;

    UIKitSkeletonView(@NonNull ThemedReactContext reactContext, UIKitShimmerRenderer renderer) {
        super(reactContext);

        setEGLContextClientVersion(3);
        setRenderer(renderer);

        renderer.connectView(this);
    }

    // --- Shimmer related ---

    public boolean shouldRender(float globalProgress) {
        mLastShouldRenderCheck = _shouldRender(globalProgress);
        return mLastShouldRenderCheck;
    }

    private boolean _shouldRender(float globalProgress) {
        if (mNeedFirstRender) {
            mNeedFirstRender = false;
            return true;
        }

        boolean shouldRender = _shouldRenderWithProgress(globalProgress);

        // Allow last frame to be rendered to clear animation
        if (mLastShouldRenderCheck && !shouldRender) {
            return true;
        }

        return shouldRender;
    }

    private boolean _shouldRenderWithProgress(float globalProgress) {
        if (mProgressCoords.end > mProgressCoords.start) {
            if (globalProgress < mProgressCoords.start || globalProgress > mProgressCoords.end) {
                return false;
            }
            return true;
        }
        if (globalProgress < mProgressCoords.start && globalProgress > mProgressCoords.end) {
            return false;
        }
        return true;
    }

    public float getProgressShift(float globalProgress) {
        return getProgress(globalProgress) * (1 + mProgressCoords.shift) - mProgressCoords.shift;
    }

    private float getProgress(float globalProgress) {
        if (mProgressCoords.end > mProgressCoords.start) {
            if (globalProgress < mProgressCoords.start || globalProgress > mProgressCoords.end) {
                return 0;
            }
            return (globalProgress - mProgressCoords.start) / (mProgressCoords.end - mProgressCoords.start);
        }
        if (globalProgress < mProgressCoords.start && globalProgress > mProgressCoords.end) {
            return 0;
        }
        if (globalProgress <= mProgressCoords.end) {
            float tail = 1 - mProgressCoords.start;
            return (globalProgress + tail) / (mProgressCoords.end + tail);
        }
        float head = mProgressCoords.end;
        return (globalProgress - mProgressCoords.start) / (1 - mProgressCoords.start + head);
    }

    public void updateProgressCoords(UIKitShimmerRenderer.ProgressCoords progressCoords) {
        mProgressCoords = progressCoords;
    }

    // MARK:- Utils

    public ViewPositionRect getViewAbsoluteCoords() {
        int[] location = new int[2];
        getLocationOnScreen(location);
        int x = location[0];
        int y = location[1];

        return new ViewPositionRect(
                x, y, getWidth(), getHeight()
        );
    }

    public static class ViewPositionRect {
        final int originX;
        final int originY;
        final int width;
        final int height;

        private ViewPositionRect(
                int originX,
                int originY,
                int width,
                int height
        ) {
            this.originX = originX;
            this.originY = originY;
            this.width = width;
            this.height = height;
        }
    }

}
