package tonlabs.uikit.hydrogen;

import android.annotation.SuppressLint;
import android.widget.ImageView;

import com.facebook.drawee.generic.RootDrawable;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.image.ReactImageView;

@SuppressLint("AppCompatCustomView")
public class HDuplicateImageView extends ImageView {
    private ThemedReactContext context;

    public HDuplicateImageView(ThemedReactContext context, HDuplicateImageViewManager hDuplicateImageViewManager) {
        super(context);
        this.context = context;
    }

    void setOriginalViewRef(int originalViewRef) {
        UIManagerModule uIManagerModule = context.getNativeModule(UIManagerModule.class);
        context.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                ReactImageView view = (ReactImageView) uIManagerModule.resolveView(originalViewRef);
                RootDrawable drawable = (RootDrawable) view.getDrawable();
                setImageDrawable(drawable);

//                DraweeController draweeController = view.getController();
//                setController(draweeController);
//                FadeDrawable drawable2 = (FadeDrawable) drawable.getDrawable();
//                Drawable drawable3 = drawable2.getDrawable(0);

//                view.get
//                new BitmapDrawable()
//                setImageBitmap();
//                Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), view.getSourceLayoutResId());
            }
        });
    }
};
