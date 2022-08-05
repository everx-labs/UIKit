package tonlabs.uikit.layout;

import android.annotation.SuppressLint;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.uimanager.ThemedReactContext;

import minus.android.support.opengl.GLTextureView;

@SuppressLint("ViewConstructor")
public class UIKitSkeletonView extends GLTextureView implements UIKitShimmerRenderer.ShimmerProgress, LifecycleEventListener {
    private final ThemedReactContext mReactContext;

    private UIKitShimmerConfiguration.ProgressCoords mProgressCoords;
    private boolean mNeedFirstRender = true;
    private boolean mLastShouldRenderCheck = false;

    UIKitSkeletonView(@NonNull ThemedReactContext reactContext, UIKitShimmerRenderer renderer) {
        super(reactContext);

        mReactContext = reactContext;

        reactContext.addLifecycleEventListener(this);

        setEGLConfigChooser(8, 8, 8, 8, 16, 0);

        setEGLContextClientVersion(3);
        setRenderer(renderer);

        setRenderMode(RENDERMODE_CONTINUOUSLY);
    }

    // MARK:- LifecycleEventListener

    @Override
    public void onHostResume() {
        onResume();
    }

    @Override
    public void onHostPause() {
        onPause();
    }

    @Override
    public void onHostDestroy() {
        // no-op
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();

        mReactContext.removeLifecycleEventListener(this);
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
            return !(globalProgress < mProgressCoords.start) && !(globalProgress > mProgressCoords.end);
        }
        return !(globalProgress < mProgressCoords.start) || !(globalProgress > mProgressCoords.end);
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

    public void updateProgressCoords(UIKitShimmerConfiguration.ProgressCoords progressCoords) {
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
