package tonlabs.uikit.layout;

import android.content.Context;
import android.graphics.Color;
import android.opengl.GLES30;
import android.opengl.GLSurfaceView;
import android.os.SystemClock;
import android.util.Log;

import androidx.annotation.ColorInt;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.DisplayMetricsHolder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

public class UIKitShimmerRenderer implements GLSurfaceView.Renderer {
    private static final String TAG = "UIKitShimmerRenderer";

    /** https://www.w3schools.com/java/java_data_types.asp */
    private static final int BYTES_PER_FLOAT = 4;
    private static final int BYTES_PER_SHORT = 2;

    // --- GLES related ---

    // Vertex buffer objects
    private static final float rectVerticesData[] = {
            -1.0f,  1.0f, 0.0f,
            1.0f,  1.0f, 0.0f,
            -1.0f, -1.0f, 0.0f,
            1.0f, -1.0f, 0.0f
    };
    private final int[] vbo = new int[1];
    private final FloatBuffer mRectVertices;
    // Index buffer objects
    private static final short rectIndicesData[] = {
            0, 3, 2,
            0, 1, 3
    };
    private final int[] ibo = new int[1];
    private final ShortBuffer mRectIndices;
    // Uniform buffer objects
    private final int[] ubo = new int[1];

    /** This will be used to pass in model position information. */
    private int mVertexPositionHandle;

    /** How many elements per vertex. */
    private final int mVertexStrideBytes = 3 * BYTES_PER_FLOAT;

    /** Offset of the position data. */
    private final int mVertexPositionOffset = 0;

    /** Size of the position data in elements. */
    private final int mVertexPositionDataSize = 3;

    private int mProgramHandle;

    // --- Shimmer related ---

    private int width = 0;
    private int height = 0;

    private final ThemedReactContext mReactContext;
    private ShimmerConfiguration mConfig;
    private UIKitSkeletonView linkedView;

    @Nullable
    static private UIKitShimmerRenderer _shared;
    static public UIKitShimmerRenderer getSharedRenderer(ThemedReactContext reactContext) {
        if (_shared == null) {
            _shared = new UIKitShimmerRenderer(reactContext);
        }
        return _shared;
    }

    UIKitShimmerRenderer(ThemedReactContext reactContext) {
        mReactContext = reactContext;

        mRectVertices = ByteBuffer
                .allocateDirect(rectVerticesData.length * BYTES_PER_FLOAT)
                .order(ByteOrder.nativeOrder())
                .asFloatBuffer();
        mRectVertices.put(rectVerticesData).position(0);

        mRectIndices = ByteBuffer
                .allocateDirect(rectIndicesData.length * BYTES_PER_SHORT)
                .order(ByteOrder.nativeOrder())
                .asShortBuffer();

        mRectIndices.put(rectIndicesData).position(0);

        mConfig = defaultConfiguration();
    }

    void connectView(UIKitSkeletonView view) {
        linkedView = view;
    }

    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        try {
            int vertexHandle = loadShimmerVertexShader(
                    R.raw.shimmer_vert
            );

            int fragmentHandle = loadShimmerFragmentShader(
                    R.raw.shimmer_frag
            );

            mProgramHandle = loadProgram(vertexHandle, fragmentHandle);
        } catch (IOException err) {
            Log.e(TAG, "Couldn't read shaders.");
            return;
        }

        // Source: https://www.learnopengles.com/tag/vbos/

        GLES30.glGenBuffers(1, vbo, 0);
        GLES30.glGenBuffers(1, ibo, 0);

        if (vbo[0] > 0 && ibo[0] > 0) {
            GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, vbo[0]);
            GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, rectVerticesData.length * BYTES_PER_FLOAT, mRectVertices, GLES30.GL_STATIC_DRAW);

            GLES30.glBindBuffer(GLES30.GL_ELEMENT_ARRAY_BUFFER, ibo[0]);
            GLES30.glBufferData(GLES30.GL_ELEMENT_ARRAY_BUFFER, rectIndicesData.length * BYTES_PER_SHORT, mRectIndices, GLES30.GL_STATIC_DRAW);

            GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, 0);
            GLES30.glBindBuffer(GLES30.GL_ELEMENT_ARRAY_BUFFER, 0);
        } else {
            // TODO: handle error
        }
    }

    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height) {
        GLES30.glViewport(0, 0, width, height);
        this.width = width;
        this.height = height;

        linkedView.updateProgressCoords(mConfig.getViewProgressCoords(linkedView));
    }

    @Override
    public void onDrawFrame(GL10 gl) {
        // TODO
        float globalProgress = 0;
        if (!linkedView.shouldRender(globalProgress)) {
            return;
        }

        ShimmerColor backgroundColor = mConfig.backgroundColor;
        // clear the our "screen"
        GLES30.glClearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
        GLES30.glClear(GLES30.GL_DEPTH_BUFFER_BIT | GLES30.GL_COLOR_BUFFER_BIT);

        // use program
        GLES30.glUseProgram(mProgramHandle);

        mVertexPositionHandle = GLES30.glGetAttribLocation(mProgramHandle, "inPosition");

        // VBO and IBO binding
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, vbo[0]);

        GLES30.glVertexAttribPointer(
                mVertexPositionHandle,
                mVertexPositionDataSize,
                GLES30.GL_FLOAT,
                false,
                mVertexStrideBytes,
                0);
        GLES30.glEnableVertexAttribArray(mVertexPositionHandle);

        GLES30.glBindBuffer(GLES30.GL_ELEMENT_ARRAY_BUFFER, ibo[0]);

        new ShimmerUniform(
                mConfig,
                linkedView.getProgressShift(globalProgress),
                width,
                height
        ).set();

        // draw
        GLES30.glDrawElements(
                GLES30.GL_TRIANGLE_STRIP,
                rectVerticesData.length,
                GLES30.GL_UNSIGNED_SHORT,
                0);

        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, 0);
        GLES30.glBindBuffer(GLES30.GL_ELEMENT_ARRAY_BUFFER, 0);
        GLES30.glBindBuffer(GLES30.GL_UNIFORM_BUFFER, 0);
    }

    private int loadShimmerVertexShader(int vertexShaderRawResourceId) throws IOException {
        return loadShimmerShader(GLES30.GL_VERTEX_SHADER, readShader(mReactContext, vertexShaderRawResourceId));
    }

    private int loadShimmerFragmentShader(int fragmentShaderRawResourceId) throws IOException {
        return loadShimmerShader(GLES30.GL_FRAGMENT_SHADER, readShader(mReactContext, fragmentShaderRawResourceId));
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

    private int loadShimmerShader(int type, String shaderSource) {
        Log.e(TAG, shaderSource);
        // Load in the vertex shader.
        int shaderHandle = GLES30.glCreateShader(type);

        if (shaderHandle != 0)
        {
            // Pass in the shader source.
            GLES30.glShaderSource(shaderHandle, shaderSource);

            // Compile the shader.
            GLES30.glCompileShader(shaderHandle);

            // Get the compilation status.
            final int[] compileStatus = new int[1];
            GLES30.glGetShaderiv(shaderHandle, GLES30.GL_COMPILE_STATUS, compileStatus, 0);

            // If the compilation failed, delete the shader.
            if (compileStatus[0] == 0)
            {
                Log.e(TAG, "Error compiling shader: " + GLES30.glGetShaderInfoLog(shaderHandle));
                GLES30.glDeleteShader(shaderHandle);
                shaderHandle = 0;
            }
        }

        if (shaderHandle == 0)
        {
            throw new RuntimeException("Error creating shader.");
        }

        return shaderHandle;
    }

    private int loadProgram(int vertexShimmerShaderHandler, int fragmentShimmerShaderHandler) {
        // Create a program object and store the handle to it.
        int programHandle = GLES30.glCreateProgram();

        if (programHandle != 0)
        {
            // Bind the vertex shader to the program.
            GLES30.glAttachShader(programHandle, vertexShimmerShaderHandler);

            // Bind the fragment shader to the program.
            GLES30.glAttachShader(programHandle, fragmentShimmerShaderHandler);

            // Bind attributes
            GLES30.glBindAttribLocation(programHandle, 0, "inPosition");

            // Link the two shaders together into a program.
            GLES30.glLinkProgram(programHandle);

            // Get the link status.
            final int[] linkStatus = new int[1];
            GLES30.glGetProgramiv(programHandle, GLES30.GL_LINK_STATUS, linkStatus, 0);

            // If the link failed, delete the program.
            if (linkStatus[0] == 0)
            {
                GLES30.glDeleteProgram(programHandle);
                programHandle = 0;
            }
        }

        if (programHandle == 0)
        {
            throw new RuntimeException("Error creating program.");
        }

        return programHandle;
    }

    static class ShimmerColor {
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

    static class ShimmerConfiguration {
        final float scaledGradientWidth;
        final float skewDegrees;
        final int shimmerDuration;
        final int skeletonDuration;
        final ShimmerColor backgroundColor;
        final ShimmerColor accentColor;

        float physicalSize;
        float physicalX0;

        ShimmerConfiguration(
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
    }

    static ShimmerConfiguration defaultConfiguration() {
        return new ShimmerConfiguration(
                100.0f,
                10.0f,
                800,
                2000,
                new ShimmerColor(Color.argb(1, 245, 246, 247)),
                new ShimmerColor(Color.argb(1, 237, 238, 241))
        );
    }

    class ShimmerUniform {
        private final ShimmerConfiguration mConfig;
        private final float progressShift;
        private final float scaledWidth;
        private final float scaledHeight;

        ShimmerUniform(
                ShimmerConfiguration config,
                float progressShift,
                float scaledWidth,
                float scaledHeight
        ) {
            mConfig = config;

            this.progressShift = progressShift;
            this.scaledWidth = scaledWidth;
            this.scaledHeight = scaledHeight;
        }

        void set() {
            int scaledGradientWidthLocation = GLES30.glGetUniformLocation(mProgramHandle, "inUniforms.gradientWidth");
            GLES30.glUniform1f(scaledGradientWidthLocation, mConfig.scaledGradientWidth);

            int skewDegreesLocation = GLES30.glGetUniformLocation(mProgramHandle, "inUniforms.skew");
            GLES30.glUniform1f(skewDegreesLocation, mConfig.skewDegrees);

            int progressShiftLocation = GLES30.glGetUniformLocation(mProgramHandle, "inUniforms.progressShift");
            GLES30.glUniform1f(progressShiftLocation, progressShift);

            int resolutionLocation = GLES30.glGetUniformLocation(mProgramHandle, "inUniforms.resolution");
            GLES30.glUniform2f(resolutionLocation, scaledWidth, scaledHeight);

            int backgroundColorLocation = GLES30.glGetUniformLocation(mProgramHandle, "inUniforms.backgroundColor");
            ShimmerColor backgroundColor = mConfig.backgroundColor;
            GLES30.glUniform4f(backgroundColorLocation, backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);

            int accentColorLocation = GLES30.glGetUniformLocation(mProgramHandle, "inUniforms.accentColor");
            ShimmerColor accentColor = mConfig.accentColor;
            GLES30.glUniform4f(accentColorLocation, accentColor.r, accentColor.g, accentColor.b, accentColor.a);
        }
    }

    // TODO: create UIKitShimmerCoordinator to manage all available renderers
    static class ShimmerGlobalProgress {
        private long mLastTime;

        float calculate(ShimmerConfiguration config) {
            long t = SystemClock.currentThreadTimeMillis();

            while (t > mLastTime + config.skeletonDuration) {
                mLastTime += config.skeletonDuration;
            }

            return ((float) (t - mLastTime)) / ((float) config.skeletonDuration);
        }
    }

    public interface ShimmerProgress {
        boolean shouldRender(float globalProgress);
        float getProgressShift(float globalProgress);
        void updateProgressCoords(ProgressCoords progressCoords);
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
