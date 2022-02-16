package tonlabs.uikit.scrolls;

public class InsetsChange {
    public final boolean animated;
    public final EdgeInsets insets;
    public final EdgeInsets indicatorInsets;
    public final float duration;

    private InsetsChange(boolean animated,
                         EdgeInsets insets,
                         EdgeInsets indicatorInsets,
                         float duration) {
        this.animated = animated;
        this.insets = insets;
        this.indicatorInsets = indicatorInsets;
        this.duration = duration;
    }

    static InsetsChange makeInstant(EdgeInsets insets) {
        return new InsetsChange(false, insets, insets, 0);
    }

    static InsetsChange makeInstant(EdgeInsets insets, EdgeInsets indicatorInsets) {
        return new InsetsChange(false, insets, indicatorInsets, 0);
    }

    static InsetsChange makeAnimated(EdgeInsets insets, float duration) {
        return new InsetsChange(true, insets, insets, duration);
    }

    static InsetsChange makeAnimated(EdgeInsets insets, EdgeInsets indicatorInsets, float duration) {
        return new InsetsChange(true, insets, indicatorInsets, duration);
    }
}
