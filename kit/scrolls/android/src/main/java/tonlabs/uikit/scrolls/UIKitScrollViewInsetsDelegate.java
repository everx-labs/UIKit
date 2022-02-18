package tonlabs.uikit.scrolls;

import android.app.Activity;
import android.view.View;

public interface UIKitScrollViewInsetsDelegate {
    View getContainerView();
    Activity getCurrentActivity();
}
