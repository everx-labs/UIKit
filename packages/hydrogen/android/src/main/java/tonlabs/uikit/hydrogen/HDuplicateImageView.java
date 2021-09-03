package tonlabs.uikit.hydrogen;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.util.Log;
import android.widget.ImageView;

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

import javax.annotation.Nullable;

@SuppressLint("AppCompatCustomView")
public class HDuplicateImageView extends ImageView {
    static String TAG = "HDuplicateImageView";

    private ThemedReactContext context;

    public HDuplicateImageView(ThemedReactContext context, HDuplicateImageViewManager hDuplicateImageViewManager) {
        super(context);
        this.context = context;
    }

    void setOriginalViewRef(int originalViewRef) {
        Log.d(TAG, "setOriginalViewRef start");

        /**
         * TODO(savelichalex): need to compare it closely
         * though second method seems to be more performant
         * and renders bitmap faster
         */
        if (false) {
            setWithDrawableOriginalViewRef(originalViewRef);
        } else {
            setWithBitmapOriginalViewRef(originalViewRef);
        }
    }

    void setWithDrawableOriginalViewRef(int originalViewRef) {
        UIManagerModule uIManagerModule = context.getNativeModule(UIManagerModule.class);

        context.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                ReactImageView view = (ReactImageView) uIManagerModule.resolveView(originalViewRef);
                setImageDrawable(view.getDrawable());
                Log.d(TAG, "setImageDrawable");
            }
        });
    }

    void setWithBitmapOriginalViewRef(int originalViewRef) {
        UIManagerModule uIManagerModule = context.getNativeModule(UIManagerModule.class);
        FrescoModule frescoModule = context.getNativeModule(FrescoModule.class);

        context.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                ReactImageView view = (ReactImageView) uIManagerModule.resolveView(originalViewRef);
                try {
                    Field imageSourceField = view.getClass().getDeclaredField("mImageSource");
                    imageSourceField.setAccessible(true);
                    ImageSource imageSource = (ImageSource) imageSourceField.get(view);

                    Method frescoModuleGetImagePipelineMethod = FrescoModule.class.getDeclaredMethod("getImagePipeline", null);
                    frescoModuleGetImagePipelineMethod.setAccessible(true);

                    ImagePipeline imagePipeline = (ImagePipeline) frescoModuleGetImagePipelineMethod.invoke(frescoModule, null);

                    if (!imagePipeline.isInBitmapMemoryCache(imageSource.getUri())) {
                        return;
                    }

                    ImageRequest imageRequest = ImageRequestBuilder.newBuilderWithSource(imageSource.getUri()).build();

                    DataSource<CloseableReference<CloseableImage>> dataSource = imagePipeline.fetchDecodedImage(imageRequest, context);

                    dataSource.subscribe(new BaseBitmapDataSubscriber() {
                        @Override
                        protected void onNewResultImpl(@Nullable Bitmap bitmap) {
                            if (bitmap == null) {
                                return;
                            }

                            setImageBitmap(bitmap);
                            Log.d(TAG, "setImageBitmap");
                        }

                        @Override
                        protected void onFailureImpl(DataSource dataSource) {
                            // Nothing to do
                        }
                    }, CallerThreadExecutor.getInstance());
                } catch (NoSuchFieldException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                }
            }
        });
    }
};
