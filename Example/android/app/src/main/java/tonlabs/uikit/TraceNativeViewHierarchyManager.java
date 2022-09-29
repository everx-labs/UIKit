package tonlabs.uikit;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.ReactStylesDiffMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.TraceUIViewOperationQueue;
import com.facebook.react.uimanager.ViewAtIndex;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManagerRegistry;

public class TraceNativeViewHierarchyManager extends NativeViewHierarchyManager {
    public TraceUIViewOperationQueue mTraceUIViewOperationQueue;

    public TraceNativeViewHierarchyManager(
            ViewManagerRegistry viewManagers) {
        super(viewManagers);
    }

    @Override
    public synchronized void createView(ThemedReactContext themedContext, int tag, String className, @Nullable ReactStylesDiffMap initialProps) {
        TraceLog.log("TraceNativeViewHierarchyManager createView " + className);
        if (className.equals("RNSScreen")) {
            mTraceUIViewOperationQueue.printableDoFrames = 10;
        }

//        long t = System.currentTimeMillis();
        super.createView(themedContext, tag, className, initialProps);
//        TraceLog.log("TraceNativeViewHierarchyManager createView - " + (System.currentTimeMillis() - t) + " " + className);
    }

    @Override
    public synchronized void manageChildren(int tag, @Nullable int[] indicesToRemove, @Nullable ViewAtIndex[] viewsToAdd, @Nullable int[] tagsToDelete) {
        final ViewGroupManager viewManager = (ViewGroupManager)this.resolveViewManager(tag);
        TraceLog.log("TraceNativeViewHierarchyManager manageChildren " + viewManager.getName() + " (calls addView)");

        super.manageChildren(tag, indicesToRemove, viewsToAdd, tagsToDelete);
    }

    @Override
    public synchronized void setChildren(int tag, ReadableArray childrenTags) {
        TraceLog.log("TraceNativeViewHierarchyManager setChildren (calls addView)");
        super.setChildren(tag, childrenTags);
    }
}
