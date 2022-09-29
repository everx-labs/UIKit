package tonlabs.uikit;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.TraceUIViewOperationQueue;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIViewOperationQueue;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.ViewManagerRegistry;
import com.facebook.react.uimanager.ViewManagerResolver;
import com.facebook.react.uimanager.events.EventDispatcher;

public class TraceUIImplementation extends UIImplementation {
    public TraceUIImplementation(
            ReactApplicationContext reactContext,
            ViewManagerRegistry viewManagerRegistry,
            EventDispatcher eventDispatcher,
            int minTimeLeftInFrameForNonBatchedOperationMs) {
        super(
                reactContext,
                viewManagerRegistry,
                new TraceUIViewOperationQueue(
                        reactContext,
                        new TraceNativeViewHierarchyManager(viewManagerRegistry),
                        minTimeLeftInFrameForNonBatchedOperationMs),
                eventDispatcher);
    }

    public void createView(int tag, String className, int rootViewTag, ReadableMap props) {
        TraceLog.log("TraceUIImplementation createView " + className);
//        long t = System.currentTimeMillis();
        super.createView(tag, className, rootViewTag, props);
//        TraceLog.log("TraceUIManagerModule creationTime - " + (System.currentTimeMillis() - t) + " " + className);
    }

    public void updateView(final int tag, final String className, final ReadableMap props) {
        TraceLog.log("TraceUIImplementation updateView " + className);
        long t = System.currentTimeMillis();
        super.updateView(tag, className, props);
        TraceLog.log("TraceUIManagerModule updateTime - " + (System.currentTimeMillis() - t) + " " + className);
    }

    public void manageChildren(
            int viewTag,
            @Nullable ReadableArray moveFrom,
            @Nullable ReadableArray moveTo,
            @Nullable ReadableArray addChildTags,
            @Nullable ReadableArray addAtIndices,
            @Nullable ReadableArray removeFrom) {
        TraceLog.log("TraceUIImplementation manageChildren1");
        super.manageChildren(viewTag, moveFrom, moveTo, addChildTags, addAtIndices, removeFrom);
        TraceLog.log("TraceUIImplementation manageChildren2");
    }
}
