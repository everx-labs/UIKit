package tonlabs.uikit.keyboard;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactApplicationContext;

import androidx.annotation.Nullable;

public class AppContextHolder {
    private static Activity sCurrentActivity;
    private static ReactApplicationContext mReactContext;
    private static boolean isSubscribedToActivityChanges = false;

    private static class VisibleViewClassMatchPredicate implements PredicateFunc<View> {
        private final Class mClazz;

        private VisibleViewClassMatchPredicate(Class clazz) {
            mClazz = clazz;
        }

        @Override
        public boolean invoke(View view) {
            return mClazz.isAssignableFrom(view.getClass()) && view.isShown();
        }
    }
    private static final VisibleViewClassMatchPredicate sVisibleReactRootViewMatcher = new VisibleViewClassMatchPredicate(ReactRootView.class);

    public static void init(final ReactApplicationContext reactContext) {
        mReactContext = reactContext;

        if (isSubscribedToActivityChanges) {
            return;
        }

        Application app = (Application) reactContext.getApplicationContext();

        if (app == null) {
            return;
        }

        app.registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
                sCurrentActivity = activity;
            }

            @Override
            public void onActivityStarted(Activity activity) {
                sCurrentActivity = activity;
            }

            @Override
            public void onActivityResumed(Activity activity) {
                sCurrentActivity = activity;
            }

            @Override
            public void onActivityPaused(Activity activity) {

            }

            @Override
            public void onActivityStopped(Activity activity) {

            }

            @Override
            public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

            }

            @Override
            public void onActivityDestroyed(Activity activity) {
                if (sCurrentActivity == activity) {
                    sCurrentActivity = null;
                }
            }
        });
    }

    public static Activity getCurrentActivity() {
        if (sCurrentActivity == null) {
            Activity tActivity = mReactContext.getCurrentActivity();

            if (tActivity != null) {
                sCurrentActivity = tActivity;
            }
        }

        return sCurrentActivity;
    }

    public static Window getWindow() {
        Activity cActivity = getCurrentActivity();

        return (cActivity == null ? null : cActivity.getWindow());
    }

    public static ReactRootView getReactRootView() {
        final Window window = getWindow();

        if (window == null) {
            return null;
        }

        final ReactRootView rootView = findChildByClass((ViewGroup) window.getDecorView(), sVisibleReactRootViewMatcher);
        return rootView;
    }

    /**
     * Returns the first instance of clazz in root for which <code>predicate</code> is evaluated as <code>true</code>.
     */
    @Nullable
    public static <T> T findChildByClass(ViewGroup root, PredicateFunc<View> predicate) {
        for (int i = 0; i < root.getChildCount(); i++) {
            View view = root.getChildAt(i);
            if (predicate.invoke(view)) {
                return ((T) view);
            }

            if (view instanceof ViewGroup) {
                view = findChildByClass((ViewGroup) view, predicate);
                if (view != null) {
                    return (T) view;
                }
            }
        }
        return null;
    }
}
