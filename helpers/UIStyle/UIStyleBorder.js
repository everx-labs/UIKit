import UIStyle from './index';

export default class UIStyleBorder {
    // borders
    static common() {
        return UIStyle.borderAround;
    }

    static bottom() {
        return UIStyle.borderBottom;
    }

    static bottomAction() {
        return UIStyle.borderBottomAction;
    }

    static left() {
        return UIStyle.borderLeft;
    }

    static top() {
        return UIStyle.borderTop;
    }

    // radius
    static radiusDefault() {
        return UIStyle.borderRadiusDefault;
    }
}
