package tonlabs.uikit.scrolls;

public class UIKitScrollViewInsetsKeyboard {
    private UIKitScrollViewInsetsDelegate mDelegate;

    UIKitScrollViewInsetsKeyboard(UIKitScrollViewInsetsDelegate delegate) {
        mDelegate = delegate;
    }

    public InsetsChange calculateInsets(EdgeInsets insets) {
        // TODO
        return InsetsChange.makeInstant(insets);
    }
}
