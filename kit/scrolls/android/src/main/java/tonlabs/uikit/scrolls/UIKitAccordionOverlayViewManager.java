package tonlabs.uikit.scrolls;

import android.annotation.SuppressLint;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import org.jetbrains.annotations.NotNull;

import java.util.Map;

@SuppressLint("LongLogTag")
@ReactModule(name = UIKitAccordionOverlayView.REACT_CLASS)
public class UIKitAccordionOverlayViewManager extends ViewGroupManager<UIKitAccordionOverlayView> {
    private static final int COMMAND_SHOW_ID = 1;
    private static final String COMMAND_SHOW_KEY = "show";
    private static final int COMMAND_APPEND_ID = 2;
    private static final String COMMAND_APPEND_KEY = "append";
    private static final int COMMAND_MOVE_AND_HIDE_ID = 3;
    private static final String COMMAND_MOVE_AND_HIDE_KEY = "moveAndHide";

    @NonNull
    @Override
    public String getName() {
        return UIKitAccordionOverlayView.REACT_CLASS;
    }

    @NonNull
    @Override
    protected UIKitAccordionOverlayView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new UIKitAccordionOverlayView(reactContext);
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
    public void receiveCommand(@NonNull @NotNull UIKitAccordionOverlayView root,
                               int commandId,
                               @Nullable ReadableArray args) {
        Assertions.assertNotNull(root);
        Assertions.assertNotNull(args);
        switch (commandId) {
            case COMMAND_SHOW_ID:
            {
                root.show(args);
                root.dispatchEvent(COMMAND_SHOW_KEY);
                return;
            }
            case COMMAND_APPEND_ID:
            {
                root.append(args);
                root.dispatchEvent(COMMAND_APPEND_KEY);
                return;
            }
            case COMMAND_MOVE_AND_HIDE_ID:
            {
                root.moveAndHide(args, new Runnable() {
                    @Override
                    public void run() {
                        root.dispatchEvent(COMMAND_MOVE_AND_HIDE_KEY);
                    }
                });
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
    public void receiveCommand(@NonNull @NotNull UIKitAccordionOverlayView root,
                               String commandKey,
                               @Nullable ReadableArray args) {
        Assertions.assertNotNull(root);
        Assertions.assertNotNull(args);
        switch (commandKey) {
            case COMMAND_SHOW_KEY:
            {
                root.show(args);
                root.dispatchEvent(COMMAND_SHOW_KEY);
                return;
            }
            case COMMAND_APPEND_KEY:
            {
                root.append(args);
                root.dispatchEvent(COMMAND_APPEND_KEY);
                return;
            }
            case COMMAND_MOVE_AND_HIDE_KEY:
            {
                root.moveAndHide(args, new Runnable() {
                    @Override
                    public void run() {
                        root.dispatchEvent(COMMAND_MOVE_AND_HIDE_KEY);
                    }
                });
                return;
            }

            default:
                throw new IllegalArgumentException(
                        String.format(
                                "Unsupported command %s received by %s.",
                                commandKey, this.getClass().getSimpleName()));
        }
    }

    // MARK:- Events

    @Override
    public @Nullable Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
            UIKitAccordionOverlayView.EVENT_COMMAND_FINISHED,
            MapBuilder.of(
                    "registrationName",
                    UIKitAccordionOverlayView.EVENT_COMMAND_FINISHED
            )
        );
    }
}
