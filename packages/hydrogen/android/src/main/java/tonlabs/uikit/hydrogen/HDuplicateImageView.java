package tonlabs.uikit.hydrogen;

import android.content.Context;
import android.util.Log;
import com.facebook.drawee.controller.AbstractDraweeControllerBuilder;
import com.facebook.react.views.image.GlobalImageLoadListener;
import com.facebook.react.views.image.ReactImageView;

public class HDuplicateImageView extends ReactImageView {
    public HDuplicateImageView(
            Context context,
            AbstractDraweeControllerBuilder draweeControllerBuilder,
            @androidx.annotation.Nullable GlobalImageLoadListener globalImageLoadListener,
            @androidx.annotation.Nullable Object callerContext
    ) {
        super(context, draweeControllerBuilder, globalImageLoadListener, callerContext);
    }

    void setOriginalViewRef(int originalViewRef) {
        // TODO some logic
        Log.i("setOriginalViewRef", String.valueOf(originalViewRef));
    }

//    @Override
//    public void setImageDrawable(@Nullable Drawable drawable) {
//        Log.i("setImageDrawable", "asd");
//    }
}
