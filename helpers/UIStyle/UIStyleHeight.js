import { StyleSheet } from 'react-native';
import UIConstant from '../UIConstant';

const styles = StyleSheet.create({
    // heights
    tinyCell: { // 16
        height: UIConstant.tinyCellHeight(),
    },
    smallCell: { // 24
        height: UIConstant.smallCellHeight(),
    },
    mediumCell: { // 40
        height: UIConstant.mediumCellHeight(),
    },
    defaultCell: { // 48
        height: UIConstant.defaultCellHeight(),
    },
    bigCell: { // 56
        height: UIConstant.bigCellHeight(),
    },
    greatCell: { // 72
        height: UIConstant.greatCellHeight(),
    },
    majorCell: { // 80
        height: UIConstant.majorCellHeight(),
    },

    minHeightGreatCell: { // 72
        minHeight: UIConstant.greatCellHeight(),
    },

    buttonHeight: {
        height: UIConstant.buttonHeight(),
    },
});

export default class UIStyleHeight {
    // heights
    static tinyCell() { // 16
        return styles.tinyCell;
    }

    static smallCell() { // 24
        return styles.smallCell;
    }

    static mediumCell() { // 40
        return styles.mediumCell;
    }

    static defaultCell() { // 48
        return styles.defaultCell;
    }

    static bigCell() { // 56
        return styles.bigCell;
    }

    static greatCell() { // 72
        return styles.greatCell;
    }

    static majorCell() { // 80
        return styles.majorCell;
    }

    static minHeightGreatCell() { // 72
        return styles.minHeightGreatCell;
    }

    static buttonHeight() {
        return styles.buttonHeight;
    }
}
