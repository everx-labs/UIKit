package tonlabs.uikit.media;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.widget.ImageView;
import androidx.annotation.Nullable;
import com.bumptech.glide.load.resource.gif.GifDrawable;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.view.ReactViewGroup;

@SuppressLint("AppCompatCustomView")
public class HDuplicateImageView extends ImageView {

    private final ThemedReactContext context;
    private final UIManagerModule uiManagerModule;

    public HDuplicateImageView(Context context) {
        super(context);
        this.context = (ThemedReactContext) context;
        uiManagerModule = this.context.getNativeModule(UIManagerModule.class);
    }

    void setOriginalViewRef(int originalViewRef) {
        context.runOnUiQueueThread(
            () -> {
                if (uiManagerModule == null) {
                    return;
                }

                try {
                    @Nullable
                    ImageView imageView = null;

                    View originalView = uiManagerModule.resolveView(originalViewRef);
                    if (originalView instanceof ReactViewGroup) {
                        ReactViewGroup reactViewGroup = (ReactViewGroup) originalView;
                        View view = reactViewGroup.getChildAt(0);
                        imageView = view instanceof ImageView ? ((ImageView) view) : null;
                    } else if (originalView instanceof ImageView) {
                        imageView = (ImageView) originalView;
                    }

                    if (imageView == null) {
                        return;
                    }

                    Drawable drawable = imageView
                        .getDrawable()
                        .getConstantState()
                        .newDrawable()
                        .mutate();

                    if (drawable instanceof BitmapDrawable) {
                        // Static image
                        BitmapDrawable bitmapDrawable = (BitmapDrawable) drawable;
                        setImageDrawable(bitmapDrawable);
                    }

                    if (drawable instanceof GifDrawable) {
                        // Gif
                        GifDrawable gifDrawable = (GifDrawable) drawable;
                        gifDrawable.start();
                        setImageDrawable(gifDrawable);
                    }
                } catch (NullPointerException e) {
                    e.printStackTrace();
                }
            }
        );
    }
}
