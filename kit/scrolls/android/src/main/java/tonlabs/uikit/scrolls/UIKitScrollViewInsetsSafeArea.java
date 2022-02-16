package tonlabs.uikit.scrolls;

public class UIKitScrollViewInsetsSafeArea {
    private UIKitScrollViewInsetsDelegate mDelegate;

    UIKitScrollViewInsetsSafeArea(UIKitScrollViewInsetsDelegate delegate) {
        mDelegate = delegate;
    }

    public InsetsChange calculateInsets(EdgeInsets insets) {
        // TODO
        return InsetsChange.makeInstant(insets);
    }
}
