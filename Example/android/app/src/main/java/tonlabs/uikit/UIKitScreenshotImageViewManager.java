package tonlabs.uikit;

import android.animation.Animator;
import android.animation.ObjectAnimator;
import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.drawable.BitmapDrawable;
import android.util.Log;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.widget.AbsoluteLayout;
import android.widget.FrameLayout;
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
import com.facebook.react.views.scroll.ReactScrollView;
import com.facebook.react.views.view.ReactViewGroup;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static android.view.View.VISIBLE;

@SuppressLint("LongLogTag")
@ReactModule(name = UIKitScreenshotImageViewManager.REACT_CLASS)
public class UIKitScreenshotImageViewManager extends ViewGroupManager<ReactViewGroup> {
    private static final int COMMAND_SHOW_ID = 1;
    private static final String COMMAND_SHOW_KEY = "show";
    private static final int COMMAND_MOVE_AND_HIDE_ID = 2;
    private static final String COMMAND_MOVE_AND_HIDE_KEY = "moveAndHide";

    private ThemedReactContext mReactContext;
    private ReactViewGroup mContainer;
    private FrameLayout mOverlayContainer;
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

        mOverlayContainer = new FrameLayout(reactContext);
        mOverlayContainer.setClipChildren(true);

        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

        mOverlayContainer.addView(mOverlayImage, lp);

        return mContainer;
    }

    // MARK:- commands

    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                COMMAND_SHOW_KEY,
                COMMAND_SHOW_ID,
                COMMAND_MOVE_AND_HIDE_KEY,
                COMMAND_MOVE_AND_HIDE_ID
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
            case COMMAND_MOVE_AND_HIDE_ID:
            {
                moveAndHide(args);
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
            case COMMAND_MOVE_AND_HIDE_KEY:
            {
                moveAndHide(args);
                return;
            }

            default:
                throw new IllegalArgumentException(
                        String.format(
                                "Unsupported command %s received by %s.",
                                commandKey, this.getClass().getSimpleName()));
        }
    }

    private void show(ReadableArray args) {
        int startY = (int) PixelUtil.toPixelFromDIP(args.getInt(0));
        int endY = (int) PixelUtil.toPixelFromDIP(args.getInt(1));

        disableScrollViewIfAny();

        BitmapDrawable screenshot = takeScreenshot(startY, endY);

        mContainer.removeView(mOverlayContainer);

        mOverlayImage.setImageDrawable(screenshot);
        mOverlayImage.setScrollY(0);
        int top = getImageTop(startY);
        mOverlayContainer.measure(screenshot.getIntrinsicWidth(), screenshot.getIntrinsicHeight());
        mOverlayContainer.layout(0, 0, screenshot.getIntrinsicWidth(), screenshot.getIntrinsicHeight());
        mOverlayContainer.setTranslationY(top);

        mContainer.addView(mOverlayContainer);
    }

    private void moveAndHide(ReadableArray args) {
        int shiftY = (int) PixelUtil.toPixelFromDIP(args.getInt(0));
        int duration = args.getInt(1);

        Log.d(REACT_CLASS, String.format("move with  shift: %d", shiftY));

        ObjectAnimator animator = ObjectAnimator.ofInt(mOverlayImage, "scrollY", -1 * shiftY);
        animator.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animation) {
                // no-op
            }

            @Override
            public void onAnimationEnd(Animator animation) {
                hide();
            }

            @Override
            public void onAnimationCancel(Animator animation) {
                hide();
            }

            @Override
            public void onAnimationRepeat(Animator animation) {
                // no-op
            }
        });
        animator.setDuration(duration);
        animator.start();
    }

    private void hide() {
        Log.d(REACT_CLASS, "hide");
        mContainer.removeView(mOverlayContainer);

        enableScrollViewIfAny();
    }

    private void disableScrollViewIfAny() {
        View view = mContainer.getChildAt(0);

        if (!(view instanceof ReactScrollView)) {
            return;
        }

        ((ReactScrollView)view).setScrollEnabled(false);
    }

    private void enableScrollViewIfAny() {
        View view = mContainer.getChildAt(0);

        if (!(view instanceof ReactScrollView)) {
            return;
        }

        ((ReactScrollView)view).setScrollEnabled(true);
    }

    private int getImageTop(int startY) {
        if (startY == 0) {
            return 0;
        }

        View view = mContainer.getChildAt(0);

        if (view instanceof ReactScrollView) {
            return startY - ((ReactScrollView) view).getScrollY();
        }
        return startY;
    }

    // MARK:- screenshot

    private BitmapDrawable takeScreenshot(int startY, int endY) {
        View view = mContainer.getChildAt(0);

        if (view instanceof ReactScrollView) {
            return takeScrollViewScreenshot((ReactScrollView) view, startY, endY);
        }
        return takeScreenshot(view, startY, endY);
    }

    private BitmapDrawable takeScreenshot(View view, int startY, int endY) {
        return takeScreenshot(view, startY, endY, view.getWidth(), view.getHeight());
    }

    private BitmapDrawable takeScrollViewScreenshot(ReactScrollView scrollView, int startY, int endY) {
        int width = scrollView.getWidth();
        int height = scrollView.getChildAt(0).getHeight();

        return takeScreenshot(scrollView.getChildAt(0), startY, endY, width, height);
    }

    private BitmapDrawable takeScreenshot(View view, int startY, int endY, int width, int height) {
        int lHeight = Math.max(height, mContainer.getHeight());
        int lEndY = Math.max(lHeight, endY);
        // TODO: might be a good idea to re-use from pool
        Bitmap fullBitmap = Bitmap.createBitmap(width, lHeight, Bitmap.Config.ARGB_8888);

        final Paint paint = new Paint();
        // TODO
        paint.setColor(Color.WHITE);
        paint.setStyle(Paint.Style.FILL);

        final Canvas c = new Canvas(fullBitmap);

        c.drawPaint(paint);

        view.draw(c);

        int croppedHeight = Math.min(lEndY - startY, lHeight - startY);
        if (croppedHeight < lHeight) {
            Bitmap croppedBitmap = Bitmap.createBitmap(fullBitmap, 0, startY, width, croppedHeight);
            return new BitmapDrawable(mReactContext.getResources(), croppedBitmap);
        }

        return new BitmapDrawable(mReactContext.getResources(), fullBitmap);
    }
}
