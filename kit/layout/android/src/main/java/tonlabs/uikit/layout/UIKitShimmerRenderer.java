package tonlabs.uikit.layout;

import android.opengl.GLES30;
import android.opengl.GLSurfaceView;
import android.util.Log;

import com.facebook.react.uimanager.ThemedReactContext;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import minus.android.support.opengl.GLTextureView;

public class UIKitShimmerRenderer implements GLTextureView.Renderer {
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
    private final UIKitShimmerSharedResources mSharedResourcesAccessor;
    private UIKitSkeletonView linkedView;

    UIKitShimmerRenderer(ThemedReactContext reactContext, UIKitShimmerSharedResources sharedResourcesAccessor) {
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

        mSharedResourcesAccessor = sharedResourcesAccessor;
    }

    void connectView(UIKitSkeletonView view) {
        linkedView = view;
    }

    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        int vertexHandle = loadShimmerShader(GLES30.GL_VERTEX_SHADER, mSharedResourcesAccessor.getVertexShader());

        int fragmentHandle = loadShimmerShader(GLES30.GL_FRAGMENT_SHADER, mSharedResourcesAccessor.getFragmentShader());

        mProgramHandle = loadProgram(vertexHandle, fragmentHandle);

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
        Log.d(TAG, "onSurfaceChanged");
        GLES30.glViewport(0, 0, width, height);
        this.width = width;
        this.height = height;

        linkedView.updateProgressCoords(mSharedResourcesAccessor.getGlobalConfiguration().getViewProgressCoords(linkedView));
    }

    public void updateConfiguration(UIKitShimmerConfiguration config) {
        linkedView.updateProgressCoords(config.getViewProgressCoords(linkedView));
    }

    @Override
    public boolean onDrawFrame(GL10 gl) {
        Log.d(TAG, String.format("onDrawFrame: %d", linkedView.getId()));

        float globalProgress = mSharedResourcesAccessor.getGlobalProgress();
        if (!linkedView.shouldRender(globalProgress)) {
            return false;
        }

        UIKitShimmerConfiguration.ShimmerColor backgroundColor = mSharedResourcesAccessor.getGlobalConfiguration().backgroundColor;
        // clear the our "screen"
        GLES30.glClearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);
//        GLES30.glClear(GLES30.GL_DEPTH_BUFFER_BIT | GLES30.GL_COLOR_BUFFER_BIT);

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
                mSharedResourcesAccessor.getGlobalConfiguration(),
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

        return true;
    }

    @Override
    public void onSurfaceDestroyed() {
        // TODO
    }

    private int loadShimmerShader(int type, String shaderSource) {
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

    class ShimmerUniform {
        private final UIKitShimmerConfiguration mConfig;
        private final float progressShift;
        private final float scaledWidth;
        private final float scaledHeight;

        ShimmerUniform(
                UIKitShimmerConfiguration config,
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
            UIKitShimmerConfiguration.ShimmerColor backgroundColor = mConfig.backgroundColor;
            GLES30.glUniform4f(backgroundColorLocation, backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a);

            int accentColorLocation = GLES30.glGetUniformLocation(mProgramHandle, "inUniforms.accentColor");
            UIKitShimmerConfiguration.ShimmerColor accentColor = mConfig.accentColor;
            GLES30.glUniform4f(accentColorLocation, accentColor.r, accentColor.g, accentColor.b, accentColor.a);
        }
    }

    public interface ShimmerProgress {
        boolean shouldRender(float globalProgress);
        float getProgressShift(float globalProgress);
        void updateProgressCoords(UIKitShimmerConfiguration.ProgressCoords progressCoords);
    }
}
