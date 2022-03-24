package tonlabs.uikit.scrolls;

import androidx.core.graphics.Insets;

public class InsetsChange {
    public final boolean animated;
    public final Insets insets;
    public final Insets indicatorInsets;
    public final float duration;

    private InsetsChange(boolean animated,
                         Insets insets,
                         Insets indicatorInsets,
                         float duration) {
        this.animated = animated;
        this.insets = insets;
        this.indicatorInsets = indicatorInsets;
        this.duration = duration;
    }

    static InsetsChange makeInstant(Insets insets) {
        return new InsetsChange(false, insets, insets, 0);
    }

    static InsetsChange makeInstant(Insets insets, Insets indicatorInsets) {
        return new InsetsChange(false, insets, indicatorInsets, 0);
    }

    static InsetsChange makeAnimated(Insets insets, float duration) {
        return new InsetsChange(true, insets, insets, duration);
    }

    static InsetsChange makeAnimated(Insets insets, Insets indicatorInsets, float duration) {
        return new InsetsChange(true, insets, indicatorInsets, duration);
    }
}
