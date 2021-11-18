package tonlabs.uikit;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.NativeGestureUtil;
import com.facebook.react.views.scroll.ReactScrollView;

import android.content.Context;
import android.graphics.Canvas;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import androidx.core.view.MotionEventCompat;

import com.facebook.react.views.scroll.ReactScrollViewHelper;
import com.facebook.react.views.scroll.ScrollEvent;
import com.facebook.react.views.scroll.ScrollEventType;
import com.mixiaoxiao.overscroll.OverScrollDelegate;
import com.mixiaoxiao.overscroll.OverScrollDelegate.OverScrollable;
import com.mixiaoxiao.overscroll.PathScroller;

import java.lang.reflect.Field;

/**
 * https://github.com/Mixiaoxiao/OverScroll-Everywhere
 *
 * @author Mixiaoxiao 2016-08-31
 */
public class ReactOverScrollView extends ReactScrollView implements OverScrollable {

    private OverScrollDelegate mOverScrollDelegate;

    private boolean mDragging;

    // ===========================================================
    // Constructors
    // ===========================================================
    public ReactOverScrollView(ReactContext context) {
        super(context);
        createOverScrollDelegate(context);
    }

    // ===========================================================
    // createOverScrollDelegate
    // ===========================================================
    private void createOverScrollDelegate(Context context) {
        mOverScrollDelegate = new OverScrollDelegate(this);
    }

    // ===========================================================
    // Delegate
    // ===========================================================
    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        final int action = MotionEventCompat.getActionMasked(ev);
        if (action == MotionEvent.ACTION_DOWN) {
            NativeGestureUtil.notifyNativeGestureStarted(this, ev);
            // TODO: it's fired twice for some reason
            ReactScrollViewHelper.emitScrollBeginDragEvent(this);
            mDragging = true;
        }
        if (mOverScrollDelegate.onInterceptTouchEvent(ev)) {
            return true;
        }
        return super.onInterceptTouchEvent(ev);
    }



    @Override
    public boolean onTouchEvent(MotionEvent event) {
        // TODO: mScrollEnabled from ReactScrollView
        final int action = MotionEventCompat.getActionMasked(event);
        if (action == MotionEvent.ACTION_UP && mDragging) {
            // TODO: velocity
            // TODO: it's fired twice for some reason
            ReactScrollViewHelper.emitScrollEndDragEvent(this, 0, 0);
            mDragging = false;
//            return true;
        }
        int offset = this.superComputeVerticalScrollOffset();
        int range = this.superComputeVerticalScrollRange() - this.superComputeVerticalScrollExtent();
        Log.d("ReactOverScrollView", String.format("range: %d, offset: %d, canScrollUp: %b, canScrollDown: %b", range, offset, offset > 0, offset < range - 1));
        if (mOverScrollDelegate.onTouchEvent(event)) {
            try {
                // TODO: create a wrapper with getter method
                Field mStateField = mOverScrollDelegate.getClass().getDeclaredField("mState"); //NoSuchFieldException
                mStateField.setAccessible(true);
                int mState = (int) mStateField.get(mOverScrollDelegate);

                // TODO: create a wrapper with getter method
                Field mOffsetYField = mOverScrollDelegate.getClass().getDeclaredField("mOffsetY"); //NoSuchFieldException
                mOffsetYField.setAccessible(true);
                float mOffsetY = (float) mOffsetYField.get(mOverScrollDelegate);

                if (mState == OverScrollDelegate.OS_DRAG_TOP || mState == OverScrollDelegate.OS_DRAG_BOTTOM) {
                    ReactContext reactContext = (ReactContext) this.getContext();
                    int surfaceId = UIManagerHelper.getSurfaceId(reactContext);
                    UIManagerHelper.getEventDispatcherForReactTag(reactContext, this.getId()).dispatchEvent(ScrollEvent.obtain(surfaceId, this.getId(), ScrollEventType.SCROLL, 0, (int) (-1 * mOffsetY), 0, 0, 0, 0, 0, 0));
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (NoSuchFieldException e) {
                e.printStackTrace();
            } catch (NullPointerException e) {
                e.printStackTrace();
            }
            return true;
        }
        return super.onTouchEvent(event);
    }

    @Override
    public void draw(Canvas canvas) {
        mOverScrollDelegate.draw(canvas);
    }

    @Override
    protected boolean overScrollBy(int deltaX, int deltaY, int scrollX, int scrollY, int scrollRangeX,
                                   int scrollRangeY, int maxOverScrollX, int maxOverScrollY, boolean isTouchEvent) {
        return mOverScrollDelegate.overScrollBy(deltaX, deltaY, scrollX, scrollY, scrollRangeX, scrollRangeY,
                maxOverScrollX, maxOverScrollY, isTouchEvent);
    }

    // ===========================================================
    // OverScrollable, aim to call view internal methods
    // ===========================================================

    @Override
    public int superComputeVerticalScrollExtent() {
        return super.computeVerticalScrollExtent();
    }

    @Override
    public int superComputeVerticalScrollOffset() {
        return super.computeVerticalScrollOffset();
    }

    @Override
    public int superComputeVerticalScrollRange() {
        return super.computeVerticalScrollRange();
    }

    @Override
    public void superOnTouchEvent(MotionEvent event) {
        super.onTouchEvent(event);
    }

    @Override
    public void superDraw(Canvas canvas) {
        super.draw(canvas);
    }

    @Override
    public boolean superAwakenScrollBars() {
        return super.awakenScrollBars();
    }

    @Override
    public boolean superOverScrollBy(int deltaX, int deltaY, int scrollX, int scrollY, int scrollRangeX,
                                     int scrollRangeY, int maxOverScrollX, int maxOverScrollY, boolean isTouchEvent) {
        return super.overScrollBy(deltaX, deltaY, scrollX, scrollY, scrollRangeX, scrollRangeY, maxOverScrollX,
                maxOverScrollY, isTouchEvent);
    }

    @Override
    public View getOverScrollableView() {
        return this;
    }

    @Override
    public OverScrollDelegate getOverScrollDelegate() {
        return mOverScrollDelegate;
    }

    @Override
    public void scrollTo(int x, int y) {
        try {
            // TODO: create a wrapper with getter method
            Field mStateField = mOverScrollDelegate.getClass().getDeclaredField("mState"); //NoSuchFieldException
            mStateField.setAccessible(true);
            int mState = (int) mStateField.get(mOverScrollDelegate);

            // TODO: create a wrapper with getter method
            Field mOffsetYField = mOverScrollDelegate.getClass().getDeclaredField("mOffsetY"); //NoSuchFieldException
            mOffsetYField.setAccessible(true);

            if (mState == OverScrollDelegate.OS_DRAG_TOP || mState == OverScrollDelegate.OS_DRAG_BOTTOM) {
                mStateField.set(mOverScrollDelegate, OverScrollDelegate.OS_NONE);
                mOffsetYField.set(mOverScrollDelegate, 0.0F);
                invalidate();
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        super.scrollTo(x, y);
    }
}