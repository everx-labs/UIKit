package tonlabs.uikit.layout;

import android.content.Context;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ThemedReactContext;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.WeakHashMap;

public class UIKitShimmerCoordinator {
    private static final String TAG = "UIKitShimmerCoordinator";

    private @Nullable String mVertexShaderCache;
    private @Nullable String mFragmentShaderCache;

    private final ShimmerGlobalProgress mShimmerGlobalProgress;

    private @Nullable ThemedReactContext mReactContext;
    private @Nullable UIKitShimmerConfiguration mConfig;

    private final WeakHashMap<UIKitSkeletonView, UIKitShimmerRenderer> mViewToRendererMap;

    @Nullable
    static private UIKitShimmerCoordinator _shared;
    static public UIKitShimmerCoordinator getSharedCoordinator() {
        if (_shared == null) {
            _shared = new UIKitShimmerCoordinator();
        }
        return _shared;
    }

    UIKitShimmerCoordinator() {
        mShimmerGlobalProgress = new ShimmerGlobalProgress();

        mViewToRendererMap = new WeakHashMap<>();
    }

    public UIKitSkeletonView createNewView(ThemedReactContext reactContext) {
        if (mReactContext != reactContext) {
            mReactContext = reactContext;
        }

        UIKitShimmerRenderer renderer = new UIKitShimmerRenderer(mReactContext, new ShimmerSharedResourcesAccessor());

        UIKitSkeletonView view = new UIKitSkeletonView(mReactContext, renderer);

        renderer.connectView(view);

        if (mViewToRendererMap.isEmpty()) {
            mShimmerGlobalProgress.setNewStartingPoint();
        }

        mViewToRendererMap.put(view, renderer);

        return view;
    }

    public UIKitShimmerConfiguration getConfig() {
        if (mConfig == null) {
            mConfig = UIKitShimmerConfiguration.defaultConfiguration();
        }
        return mConfig;
    }

    public void updateConfiguration(UIKitShimmerConfiguration newConfig) {
        mConfig = newConfig;

        for (UIKitShimmerRenderer renderer : mViewToRendererMap.values()) {
            renderer.updateConfiguration(newConfig);
        }
    }

    static class ShimmerGlobalProgress {
        private long mLastTime;

        void setNewStartingPoint() {
            mLastTime = System.currentTimeMillis();
        }

        public float calculate(UIKitShimmerConfiguration config) {
            long t = System.currentTimeMillis();

            while (t > mLastTime + config.skeletonDuration) {
                mLastTime += config.skeletonDuration;
            }

            return ((float) (t - mLastTime)) / ((float) config.skeletonDuration);
        }
    }

    private String readShader(Context context, int rawResourceId) throws IOException {
        StringBuilder buffer = new StringBuilder();
        InputStream inputStream = context.getResources().openRawResource(rawResourceId);
        BufferedReader in = new BufferedReader(new InputStreamReader(inputStream));

        String read = in.readLine();
        while (read != null) {
            buffer.append(read + "\n");
            read = in.readLine();
        }

        inputStream.close();

        buffer.deleteCharAt(buffer.length() - 1);
        return buffer.toString();
    }

    private String getSharedVertexShader() {
        if (mReactContext == null) {
            throw new RuntimeException("Couldn't read shimmer vertex shader.");
        }
        try {
            if (mVertexShaderCache == null) {
                mVertexShaderCache = readShader(mReactContext, R.raw.shimmer_vert);
            }
            return mVertexShaderCache;
        } catch (IOException err) {
            Log.e(TAG, "Couldn't read shimmer vertex shader.");
            throw new RuntimeException("Couldn't read shimmer vertex shader.");
        }
    }

    private String getSharedFragmentShader() {
        if (mReactContext == null) {
            throw new RuntimeException("Couldn't read shimmer vertex shader.");
        }
        try {
            if (mFragmentShaderCache == null) {
                mFragmentShaderCache = readShader(mReactContext, R.raw.shimmer_frag);
            }
            return mFragmentShaderCache;
        } catch (IOException err) {
            Log.e(TAG, "Couldn't read shimmer fragment shader.");
            throw new RuntimeException("Couldn't read shimmer fragment shader.");
        }
    }

    public class ShimmerSharedResourcesAccessor implements UIKitShimmerSharedResources {
        @Override
        public String getVertexShader() {
            return getSharedVertexShader();
        }

        @Override
        public String getFragmentShader() {
            return getSharedFragmentShader();
        }

        @Override
        public float getGlobalProgress() {
            return mShimmerGlobalProgress.calculate(getConfig());
        }

        @Override
        public UIKitShimmerConfiguration getGlobalConfiguration() {
            return getConfig();
        }
    }
}
