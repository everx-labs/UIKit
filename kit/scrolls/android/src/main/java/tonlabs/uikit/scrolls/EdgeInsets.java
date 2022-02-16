package tonlabs.uikit.scrolls;

public class EdgeInsets {
    public final float top;
    public final float right;
    public final float bottom;
    public final float left;

    EdgeInsets(float top, float right, float bottom, float left) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    public boolean equalsToEdgeInsets(EdgeInsets other) {
        if (this == other) {
            return true;
        }
        return this.top == other.top && this.right == other.right && this.bottom == other.bottom && this.left == other.left;
    }

    public EdgeInsets copy() {
        return new EdgeInsets(
                this.top,
                this.right,
                this.bottom,
                this.left
        );
    }
}
