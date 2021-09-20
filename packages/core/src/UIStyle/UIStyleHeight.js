// @flow
import { StyleSheet } from 'react-native';
import UIConstant from '../UIConstant';

export const heightStyles = {
    none: {
        height: null,
    },
    tinyCell: {
        // 16
        height: UIConstant.tinyCellHeight(),
    },
    littleCell: {
        // 20
        height: UIConstant.tinyButtonHeight(),
    },
    smallCell: {
        // 24
        height: UIConstant.smallCellHeight(),
    },
    mediumCell: {
        // 40
        height: UIConstant.mediumCellHeight(),
    },
    defaultCell: {
        // 48
        height: UIConstant.defaultCellHeight(),
    },
    bigCell: {
        // 56
        height: UIConstant.bigCellHeight(),
    },
    greatCell: {
        // 72
        height: UIConstant.greatCellHeight(),
    },
    majorCell: {
        // 80
        height: UIConstant.majorCellHeight(),
    },

    minHeightGreatCell: {
        // 72
        minHeight: UIConstant.greatCellHeight(),
    },

    buttonHeight: {
        // 48
        height: UIConstant.buttonHeight(),
    },
    fullHeight: {
        height: '100%',
    },
};

const styles = StyleSheet.create(heightStyles);

export default class UIStyleHeight {
    static none() {
        // null
        return styles.none;
    }

    static tinyCell() {
        // 16
        return styles.tinyCell;
    }

    static littleCell() {
        // 20
        return styles.littleCell;
    }

    static smallCell() {
        // 24
        return styles.smallCell;
    }

    static mediumCell() {
        // 40
        return styles.mediumCell;
    }

    static defaultCell() {
        // 48
        return styles.defaultCell;
    }

    static bigCell() {
        // 56
        return styles.bigCell;
    }

    static greatCell() {
        // 72
        return styles.greatCell;
    }

    static majorCell() {
        // 80
        return styles.majorCell;
    }

    static minHeightGreatCell() {
        // 72
        return styles.minHeightGreatCell;
    }

    static buttonHeight() {
        // 48
        return styles.buttonHeight;
    }

    static full() {
        return styles.fullHeight;
    }
}
