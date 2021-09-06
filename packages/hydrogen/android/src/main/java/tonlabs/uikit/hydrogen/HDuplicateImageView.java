package tonlabs.uikit.hydrogen;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.widget.ImageView;
import androidx.annotation.Nullable;
import com.facebook.common.executors.CallerThreadExecutor;
import com.facebook.common.references.CloseableReference;
import com.facebook.datasource.DataSource;
import com.facebook.imagepipeline.core.ImagePipeline;
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber;
import com.facebook.imagepipeline.image.CloseableImage;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;
import com.facebook.react.modules.fresco.FrescoModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.image.ReactImageView;
import com.facebook.react.views.imagehelper.ImageSource;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

@SuppressLint("AppCompatCustomView")
public class HDuplicateImageView extends ImageView {

    private final ThemedReactContext context;

    public HDuplicateImageView(Context context) {
        super(context);
        this.context = (ThemedReactContext) context;
    }

    void setOriginalViewRef(int originalViewRef) {
        setWithBitmapOriginalViewRef(originalViewRef);
    }

    void setWithBitmapOriginalViewRef(int originalViewRef) {
        UIManagerModule uiManagerModule = context.getNativeModule(UIManagerModule.class);
        FrescoModule frescoModule = context.getNativeModule(FrescoModule.class);

        context.runOnUiQueueThread(
            () -> {
                if (uiManagerModule == null) {
                    return;
                }
                ReactImageView view = (ReactImageView) uiManagerModule.resolveView(originalViewRef);
                try {
                    Field imageSourceField = view.getClass().getDeclaredField("mImageSource");
                    imageSourceField.setAccessible(true);
                    ImageSource imageSource = (ImageSource) imageSourceField.get(view);

                    Method frescoModuleGetImagePipelineMethod =
                        FrescoModule.class.getDeclaredMethod("getImagePipeline");
                    frescoModuleGetImagePipelineMethod.setAccessible(true);

                    ImagePipeline imagePipeline = (ImagePipeline) frescoModuleGetImagePipelineMethod.invoke(
                        frescoModule
                    );

                    if (
                        imagePipeline == null ||
                        imageSource == null ||
                        !imagePipeline.isInBitmapMemoryCache(imageSource.getUri())
                    ) {
                        return;
                    }

                    ImageRequest imageRequest = ImageRequestBuilder
                        .newBuilderWithSource(imageSource.getUri())
                        .build();

                    DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(
                        imageRequest,
                        context
                    );

                    BaseBitmapDataSubscriber baseBitmapDataSubscriber = new BaseBitmapDataSubscriber() {
                        @Override
                        protected void onNewResultImpl(@Nullable Bitmap bitmap) {
                            if (bitmap == null) {
                                return;
                            }

                            setImageBitmap(bitmap);
                        }

                        @Override
                        protected void onFailureImpl(DataSource dataSource) {
                            // Nothing to do
                        }
                    };

                    CallerThreadExecutor callerThreadExecutor = CallerThreadExecutor.getInstance();

                    dataSource.subscribe(baseBitmapDataSubscriber, callerThreadExecutor);
                } catch (
                    NoSuchFieldException
                    | IllegalAccessException
                    | NoSuchMethodException
                    | InvocationTargetException
                    | NullPointerException e
                ) {
                    e.printStackTrace();
                }
            }
        );
    }
}
