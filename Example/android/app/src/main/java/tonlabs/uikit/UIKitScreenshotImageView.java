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
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.imagepipeline.memory.BitmapPool;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.uimanager.events.RCTModernEventEmitter;
import com.facebook.react.views.scroll.ReactScrollView;
import com.facebook.react.views.view.ReactViewGroup;

@SuppressLint("LongLogTag")
public class UIKitScreenshotImageView extends ReactViewGroup {
    private FrameLayout mOverlayContainer;
    private ImageView mOverlayImage;
    private Animator.AnimatorListener mOverlayImageAnimatorListener;
    private EventDispatcher mEventDispatcher;

    public static final String EVENT_COMMAND_FINISHED = "onCommandFinished";
    public static final String REACT_CLASS = "UIKitScreenshotImageView";

    UIKitScreenshotImageView(@NonNull ThemedReactContext reactContext) {
        super(reactContext);

        mOverlayImage = new ImageView(reactContext);

        /**
         * Container around an image is important
         * to do kind of 'overflow: hidden'
         * when the image is moved out of it's bounds
         */
        mOverlayContainer = new FrameLayout(reactContext);
        mOverlayContainer.setClipChildren(true);

        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

        mOverlayContainer.addView(mOverlayImage, lp);

        mOverlayImageAnimatorListener = new Animator.AnimatorListener() {
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
        };

        mEventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
    }

    // MARK:- commands

    public void show(ReadableArray args) {
        int startY = (int) PixelUtil.toPixelFromDIP(args.getInt(0));
        int endY = (int) PixelUtil.toPixelFromDIP(args.getInt(1));

        /**
         * Prevent scrolling during animation
         * to make the whole thing easier to work with
         * and remove edge cases
         */
        disableScrollViewIfAny();

        BitmapDrawable screenshot = takeScreenshot(startY, endY);

        /**
         * Just in case the command was fired before 'hide' was called
         */
        removeView(mOverlayContainer);

        mOverlayImage.setImageDrawable(screenshot);
        mOverlayImage.setScrollY(0);
        int top = getImageTop(startY);
        mOverlayContainer.measure(screenshot.getIntrinsicWidth(), screenshot.getIntrinsicHeight());
        mOverlayContainer.layout(0, 0, screenshot.getIntrinsicWidth(), screenshot.getIntrinsicHeight());
        mOverlayContainer.setTranslationY(top);

        addView(mOverlayContainer);
    }

    public void moveAndHide(ReadableArray args) {
        int shiftY = (int) PixelUtil.toPixelFromDIP(args.getInt(0));
        int duration = args.getInt(1);

        Log.d(REACT_CLASS, String.format("move with  shift: %d", shiftY));

        /**
         * (savelichalex):
         * I have tried to animate "translateY" at first,
         * but it was impossible to clip part of the image
         * that went out of bounds of wrapping container.
         *
         * Fortunately any View has `scrollY` (that is also used for ScrollView)
         * that helps to emulate 'overflow: hidden'
         */
        ObjectAnimator animator = ObjectAnimator.ofInt(mOverlayImage, "scrollY", -1 * shiftY);
        animator.addListener(mOverlayImageAnimatorListener);
        animator.setDuration(duration);
        animator.start();
    }

    private void hide() {
        Log.d(REACT_CLASS, "hide");
        removeView(mOverlayContainer);

        enableScrollViewIfAny();
    }

    public void append(ReadableArray args) {
        int startY = (int) PixelUtil.toPixelFromDIP(args.getInt(0));
        int endY = (int) PixelUtil.toPixelFromDIP(args.getInt(1));

        BitmapDrawable screenshot = takeScreenshot(startY, endY);
        BitmapDrawable prevScreenshot = (BitmapDrawable) mOverlayImage.getDrawable();

        Bitmap combinedScreenshotBitmap = Bitmap.createBitmap(
                prevScreenshot.getIntrinsicWidth(),
                prevScreenshot.getIntrinsicHeight() + screenshot.getIntrinsicHeight(),
                Bitmap.Config.ARGB_8888);

        final Canvas c = new Canvas(combinedScreenshotBitmap);
        final Paint paint = new Paint();

        c.drawBitmap(prevScreenshot.getBitmap(), 0.0f, 0.0f, paint);
        c.drawBitmap(screenshot.getBitmap(), 0.0f, prevScreenshot.getIntrinsicHeight(), paint);

        BitmapDrawable combinedScreenshot = new BitmapDrawable(getReactContext().getResources(), combinedScreenshotBitmap);

        mOverlayImage.setImageDrawable(combinedScreenshot);
        mOverlayContainer.measure(combinedScreenshot.getIntrinsicWidth(), combinedScreenshot.getIntrinsicHeight());
        mOverlayContainer.layout(0, 0, combinedScreenshot.getIntrinsicWidth(), combinedScreenshot.getIntrinsicHeight());
    }

    public void dispatchEvent(String commandKey) {
        mEventDispatcher.dispatchEvent(createCommandFinishedEvent(commandKey));
    }

    // MARK:- Helpers

    private void disableScrollViewIfAny() {
        View view = getChildAt(0);

        if (!(view instanceof ReactScrollView)) {
            return;
        }

        ((ReactScrollView)view).setScrollEnabled(false);
    }

    private void enableScrollViewIfAny() {
        View view = getChildAt(0);

        if (!(view instanceof ReactScrollView)) {
            return;
        }

        ((ReactScrollView)view).setScrollEnabled(true);
    }

    private int getImageTop(int startY) {
        if (startY == 0) {
            return 0;
        }

        View view = getChildAt(0);

        if (view instanceof ReactScrollView) {
            return startY - ((ReactScrollView) view).getScrollY();
        }
        return startY;
    }

    // MARK:- screenshot

    private BitmapDrawable takeScreenshot(int startY, int endY) {
        View view = getChildAt(0);

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
        int lHeight = Math.max(height, getHeight());
        // TODO: might be a good idea to re-use from pool
        Bitmap fullBitmap = Bitmap.createBitmap(width, lHeight, Bitmap.Config.ARGB_8888);

        final Paint paint = new Paint();
        // TODO
        paint.setColor(Color.WHITE);
        paint.setStyle(Paint.Style.FILL);

        final Canvas c = new Canvas(fullBitmap);

        c.drawPaint(paint);

        view.draw(c);

        int croppedHeight = Math.min(endY - startY, lHeight - startY);
        if (croppedHeight < lHeight) {
            Bitmap croppedBitmap = Bitmap.createBitmap(fullBitmap, 0, startY, width, croppedHeight);
            return new BitmapDrawable(getReactContext().getResources(), croppedBitmap);
        }

        return new BitmapDrawable(getReactContext().getResources(), fullBitmap);
    }

    // MARK:- React

    private ThemedReactContext getReactContext() {
        return (ThemedReactContext)getContext();
    }

    CommandFinishedEvent createCommandFinishedEvent(String commandKey) {
        return new CommandFinishedEvent(
                UIManagerHelper.getSurfaceId(this),
                getId(),
                commandKey
        );
    }

    private class CommandFinishedEvent extends Event<UIKitScreenshotImageView.CommandFinishedEvent> {
        private String mCommandKey;

        CommandFinishedEvent(int surfaceId, int viewId, String commandKey) {
            super(surfaceId, viewId);
            mCommandKey = commandKey;
        }

        @Override
        public String getEventName() {
            return EVENT_COMMAND_FINISHED;
        }

        @Override
        protected WritableMap getEventData() {
            WritableMap event = Arguments.createMap();
            event.putString("finishedCommand", mCommandKey);
            return event;
        }
    }
}
