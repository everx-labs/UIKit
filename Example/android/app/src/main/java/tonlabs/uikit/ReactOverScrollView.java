package tonlabs.uikit;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.NativeGestureUtil;
import com.facebook.react.views.scroll.ReactScrollView;

import android.content.Context;
import android.graphics.Canvas;
import android.os.Build;
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
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Objects;

/**
 * https://github.com/Mixiaoxiao/OverScroll-Everywhere
 *
 * @author Mixiaoxiao 2016-08-31
 */
public class ReactOverScrollView extends ReactScrollView implements OverScrollable {

    private OverScrollDelegate mOverScrollDelegate;

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
        if (!getScrollEnabled()) {
            return false;
        }

        final int action = MotionEventCompat.getActionMasked(ev);
        if (action == MotionEvent.ACTION_DOWN) {
            setParentDragging(true);
        }

        boolean parentIntercepted = super.onInterceptTouchEvent(ev);
        boolean overScrollIntercepted = mOverScrollDelegate.onInterceptTouchEvent(ev);

        return parentIntercepted || overScrollIntercepted;
    }

    Field parentDraggingField;

    boolean getParentDragging() {
        try {
            // TODO: create a wrapper with getter method
            if (parentDraggingField == null) {
                parentDraggingField = getClass().getSuperclass().getDeclaredField("mDragging"); //NoSuchFieldException
                parentDraggingField.setAccessible(true);
            }
            return (boolean) parentDraggingField.get(this);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        return false;
    }

    void setParentDragging(boolean val) {
        try {
            // TODO: create a wrapper with getter method
            if (parentDraggingField == null) {
                parentDraggingField = getClass().getSuperclass().getDeclaredField("mDragging"); //NoSuchFieldException
                parentDraggingField.setAccessible(true);
            }
            parentDraggingField.set(this, val);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
    }

    Field mScrollEnabledField;

    boolean getScrollEnabled() {
        try {
            // TODO: create a wrapper with getter method
            if (mScrollEnabledField == null) {
                mScrollEnabledField = getClass().getSuperclass().getDeclaredField("mScrollEnabled"); //NoSuchFieldException
                mScrollEnabledField.setAccessible(true);
            }
            return (boolean) mScrollEnabledField.get(this);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        if (!getScrollEnabled()) {
            return false;
        }

        if (mOverScrollDelegate.onTouchEvent(ev)) {
            int mState = getOverScrollState();
            if (mState == OverScrollDelegate.OS_DRAG_TOP || mState == OverScrollDelegate.OS_DRAG_BOTTOM) {
                ReactContext reactContext = (ReactContext) this.getContext();
                int surfaceId = UIManagerHelper.getSurfaceId(reactContext);
                UIManagerHelper
                        .getEventDispatcherForReactTag(reactContext, this.getId())
                        .dispatchEvent(
                                ScrollEvent.obtain(
                                        surfaceId,
                                        this.getId(),
                                        ScrollEventType.SCROLL,
                                        0,
                                        (int) (-1 * getOverScrollOffsetY() * ev.getYPrecision()),
                                        0,
                                        0,
                                        0,
                                        0,
                                        0,
                                        0));
            }
            return true;
        }

        return super.onTouchEvent(ev);
    }

    Field overScrollStateField;

    int getOverScrollState() {
        try {
            // TODO: create a wrapper with getter method
            if (overScrollStateField == null) {
                overScrollStateField = mOverScrollDelegate.getClass().getDeclaredField("mState"); //NoSuchFieldException
                overScrollStateField.setAccessible(true);
            }
            return (int) overScrollStateField.get(mOverScrollDelegate);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        return 0;
    }

    Field overScrollOffsetYField;

    float getOverScrollOffsetY() {
        try {
            // TODO: create a wrapper with getter method
            if (overScrollOffsetYField == null) {
                overScrollOffsetYField = mOverScrollDelegate.getClass().getDeclaredField("mOffsetY"); //NoSuchFieldException
                overScrollOffsetYField.setAccessible(true);
            }
            return (float) overScrollOffsetYField.get(mOverScrollDelegate);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        return 0.0F;
    }

    Method superHandlePostTouchScrolling;

    public void callSuperHandlePostTouchScrolling(int velocityX, int velocityY) {
        try {
            if (superHandlePostTouchScrolling == null) {
                superHandlePostTouchScrolling = Objects.requireNonNull(getClass().getSuperclass()).getDeclaredMethod("handlePostTouchScrolling", int.class, int.class);
                superHandlePostTouchScrolling.setAccessible(true);
            }
            superHandlePostTouchScrolling.invoke(this, velocityX, velocityY);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
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
                mOffsetYField.set(mOverScrollDelegate, y);
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