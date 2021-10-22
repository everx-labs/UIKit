package tonlabs.uikit.inputs;

import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.NativeViewHierarchyOptimizer;

public class CustomKeyboardViewShadowNode extends LayoutShadowNode {
    private final CustomKeyboardLayout.Ref mLayoutRef = new CustomKeyboardLayout.Ref();

    CustomKeyboardViewShadowNode(CustomKeyboardLayout layout) {
        setStyleHeight(0);

        mLayoutRef.set(layout);
        mLayoutRef.get().setShadowNode(this);
    }

    @Override
    public void onBeforeLayout(NativeViewHierarchyOptimizer nativeViewHierarchyOptimizer) {
        mLayoutRef.get().setShadowNode(this);
    }

    public void setHeight(int height) {
        setStyleHeight(height);
    }
}
