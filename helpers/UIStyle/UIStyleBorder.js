import { StyleSheet } from 'react-native';

import UIConstant from '../UIConstant';
import UIColor from '../UIColor';

const borderTop = {
    borderTopColor: UIColor.light(),
    borderTopWidth: 1,
};

const borderBottom = {
    borderBottomColor: UIColor.light(),
    borderBottomWidth: 1,
};

const cellBorderBottom = {
    borderBottomColor: UIColor.whiteLight(),
    borderBottomWidth: 1,
};

const cellBorderTop = {
    borderTopColor: UIColor.whiteLight(),
    borderTopWidth: 1,
};

const borderBottomAction = {
    borderBottomColor: UIColor.primary(),
    borderBottomWidth: 1,
};

export const borderLeft = {
    borderLeftColor: UIColor.light(),
    borderLeftWidth: 1,
};

const borderRight = {
    borderRightColor: UIColor.light(),
    borderRightWidth: 1,
};

export const borderProps = {
    borderAround: {
        ...borderTop,
        ...borderBottom,
        ...borderLeft,
        ...borderRight,
    },
    borderBottom: {
        ...borderBottom,
    },
    borderLeft: {
        ...borderLeft,
    },
    borderTop: {
        ...borderTop,
    },
    borderBottomAction: {
        ...borderBottomAction,
    },
    cellBorderTop: {
        ...cellBorderTop,
    },
    cellBorderBottom: {
        ...cellBorderBottom,
    },
    borderRadiusDefault: {
        borderRadius: UIConstant.borderRadius(),
    },
};

const styles = StyleSheet.create(borderProps);

export default class UIStyleBorder {
    // borders
    static common() {
        return styles.borderAround;
    }

    static bottom() {
        return styles.borderBottom;
    }

    static bottomAction() {
        return styles.borderBottomAction;
    }

    static left() {
        return styles.borderLeft;
    }

    static top() {
        return styles.borderTop;
    }

    // radius
    static radiusDefault() {
        return styles.borderRadiusDefault;
    }
}
