package tonlabs.uikit;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.drawable.BitmapDrawable;
import android.util.Log;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsoluteLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.views.view.ReactViewGroup;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static android.view.View.VISIBLE;

@ReactModule(name = UIKitScreenshotImageViewManager.REACT_CLASS)
public class UIKitScreenshotImageViewManager extends ViewGroupManager<ReactViewGroup> {
    private static final int COMMAND_SHOW_ID = 1;
    private static final String COMMAND_SHOW_KEY = "show";
    private static final int COMMAND_HIDE_ID = 2;
    private static final String COMMAND_HIDE_KEY = "hide";

    private ThemedReactContext mReactContext;
    private ReactViewGroup mContainer;
    private ImageView mOverlayImage;

    protected static final String REACT_CLASS = "UIKitScreenshotImageView";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected ReactViewGroup createViewInstance(@NonNull ThemedReactContext reactContext) {
        mReactContext = reactContext;
        mContainer = new ReactViewGroup(reactContext);
        mOverlayImage = new ImageView(reactContext);

        // TODO: not sure that it should be add from the start though
        // mContainer.addView(mOverlayImage);

        return mContainer;
    }

    // MARK:- commands

    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "show",
                COMMAND_SHOW_ID,
                "hide",
                COMMAND_HIDE_ID
        );
    }

    @Override
    public void receiveCommand(@NonNull @NotNull ReactViewGroup root,
                               int commandId,
                               @Nullable ReadableArray args) {
        Assertions.assertNotNull(root);
        Assertions.assertNotNull(args);
        switch (commandId) {
            case COMMAND_SHOW_ID:
            {
                show(args);
                return;
            }
            case COMMAND_HIDE_ID:
            {
                hide(args);
                return;
            }

            default:
                throw new IllegalArgumentException(
                        String.format(
                                "Unsupported command %d received by %s.",
                                commandId, this.getClass().getSimpleName()));
        }
    }

    @Override
    public void receiveCommand(@NonNull @NotNull ReactViewGroup root,
                               String commandKey,
                               @Nullable ReadableArray args) {
        Assertions.assertNotNull(root);
        Assertions.assertNotNull(args);
        switch (commandKey) {
            case COMMAND_SHOW_KEY:
            {
                show(args);
                return;
            }
            case COMMAND_HIDE_KEY:
            {
                hide(args);
                return;
            }

            default:
                throw new IllegalArgumentException(
                        String.format(
                                "Unsupported command %s received by %s.",
                                commandKey, this.getClass().getSimpleName()));
        }
    }

    @SuppressLint("LongLogTag")
    private void show(ReadableArray args) {
        int startY = (int) PixelUtil.toPixelFromDIP(args.getInt(0));
        int endY = (int) PixelUtil.toPixelFromDIP(args.getInt(1));
        Log.d(REACT_CLASS, String.format("startY: %d, endY: %d", startY, endY));
        BitmapDrawable screenshot = takeScreenshot(startY, endY);

        mContainer.removeView(mOverlayImage);

        mOverlayImage.setImageDrawable(screenshot);
        int top = getImageTop(startY);
        mOverlayImage.layout(0, top, mContainer.getWidth(), mContainer.getHeight() + top);
        mContainer.addView(mOverlayImage);
    }

    private void hide(ReadableArray args) {
        mContainer.removeView(mOverlayImage);
    }

    int getImageTop(int startY) {
        if (startY == 0) {
            return 0;
        }

        View view = mContainer.getChildAt(0);

        if (view instanceof ScrollView) {
            return startY - ((ScrollView) view).getScrollY();
        }
        return startY;
    }

    // MARK:- screenshot

    BitmapDrawable takeScreenshot(int startY, int endY) {
        View view = mContainer.getChildAt(0);

        if (view instanceof ScrollView) {
            return takeScrollViewScreenshot((ScrollView) view, startY, endY);
        }
        return takeScreenshot(view, startY, endY);
    }

    BitmapDrawable takeScreenshot(View view, int startY, int endY) {
        return takeScreenshot(view, startY, endY, view.getWidth(), view.getHeight());
    }

    BitmapDrawable takeScrollViewScreenshot(ScrollView scrollView, int startY, int endY) {
        int width = scrollView.getWidth();
        int height = scrollView.getChildAt(0).getHeight();

        return takeScreenshot(scrollView.getChildAt(0), startY, endY, width, height);
    }

    BitmapDrawable takeScreenshot(View view, int startY, int endY, int width, int height) {
        // TODO: might be a good idea to re-use from pool
        Bitmap fullBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

        final Paint paint = new Paint();
        paint.setAntiAlias(true);
        paint.setFilterBitmap(true);
        paint.setDither(true);

        final Canvas c = new Canvas(fullBitmap);

        view.draw(c);

        // TODO: do we need it?
        //after view is drawn, go through children
//        final List<View> childrenList = getAllChildren(view);
//
//        for (final View child : childrenList) {
//            // skip any child that we don't know how to process
//            if (!(child instanceof TextureView)) continue;
//
//            // skip all invisible to user child views
//            if (child.getVisibility() != VISIBLE) continue;
//
//            final TextureView tvChild = (TextureView) child;
//            tvChild.setOpaque(false); // <-- switch off background fill
//
//            if (child.getBottom() < startY || child.getTop() > endY) continue;
//
//            // TODO: might be a good idea to re-use from pool
//            final Bitmap childBitmapBuffer = Bitmap.createBitmap(child.getWidth(), child.getHeight(), Bitmap.Config.ARGB_8888);
//
//            final int countCanvasSave = c.save();
//            // TODO: should we do the same?
//            // applyTransformations(c, view, child);
//
//            // TODO: actually no re-use here yet
//            // due to re-use of bitmaps for screenshot, we can get bitmap that is bigger in size than requested
//            c.drawBitmap(childBitmapBuffer, 0, 0, paint);
//
//            c.restoreToCount(countCanvasSave);
//        }

        int croppedHeight = endY - startY;
        if (croppedHeight < height) {
            Bitmap croppedBitmap = Bitmap.createBitmap(fullBitmap, 0, startY, width, croppedHeight);
            return new BitmapDrawable(mReactContext.getResources(), croppedBitmap);
        }

        return new BitmapDrawable(mReactContext.getResources(), fullBitmap);
    }

    @NonNull
    private List<View> getAllChildren(@NonNull final View v) {
        if (!(v instanceof ViewGroup)) {
            final ArrayList<View> viewArrayList = new ArrayList<>();
            viewArrayList.add(v);

            return viewArrayList;
        }

        final ArrayList<View> result = new ArrayList<>();

        ViewGroup viewGroup = (ViewGroup) v;
        for (int i = 0; i < viewGroup.getChildCount(); i++) {
            View child = viewGroup.getChildAt(i);

            //Do not add any parents, just add child elements
            result.addAll(getAllChildren(child));
        }

        return result;
    }
}
