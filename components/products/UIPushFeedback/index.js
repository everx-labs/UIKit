// @flow
import React from 'react';
import { View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UIColor from '../../../helpers/UIColor';
import UIComponent from '../../UIComponent';
import UIGrid from '../../layout/UIGrid';
import UIGridColumn from '../../layout/UIGridColumn';
import UILink from '../../buttons/UILink';
import UILocalized from '../../../helpers/UILocalized';

import icoClose from '../../../assets/ico-close/close-blue.png';

type Props = {
    style?: ViewStyleProp,
    closable?: boolean,
    onClose: ()=>void,
    onPress: ()=>void,
}
type State = {
    isVisible: boolean,
    gridColumns: number,
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        right: 0,
        top: (UIConstant.bigCellHeight() - UIConstant.smallButtonHeight()) / 2,
    },
});

export default class UIPushFeedback extends UIComponent<Props, State> {
    static defaultProps = {
        onClose: () => {},
    };

    grid: any;
    constructor(props: Props) {
        super(props);

        this.state = {
            isVisible: true,
            gridColumns: 8,
        };
        this.grid = null;
    }

    // Events
    onGridLayout = () => {
        if (this.grid) {
            this.setStateSafely({ gridColumns: this.grid.getColumns() });
        }
    };

    onRef = (ref: any) => {
        this.grid = ref;
    };

    onClose = () => {
        this.setStateSafely({ isVisible: false });
        this.props.onClose();
    };

    // Getters
    isLarge() {
        return this.state.gridColumns === 8;
    }

    // Render
    render() {
        if (!this.state.isVisible) {
            return null;
        }

        const backColor = UIColor.primary1();
        const backColorStyle = UIColor.getBackgroundColorStyle(backColor);
        return (
            <View style={backColorStyle}>
                <UIGrid
                    type={UIGrid.Type.C8}
                    ref={this.onRef}
                    onLayout={this.onGridLayout}
                    style={backColorStyle}
                >
                    <UIGridColumn medium={this.state.gridColumns}>
                        <TouchableWithoutFeedback onPress={this.props.onPress}>
                            <View style={[
                                UIStyle.height.bigCell(),
                                UIStyle.common.alignCenter(),
                                UIStyle.common.justifyCenter(),
                                UIStyle.width.full(),
                                this.props.style,
                            ]}
                            >
                                <Text style={UIStyle.text.actionSmallBold()}>
                                    {this.isLarge()
                                        ? UILocalized.PushFeedbackLong
                                        : UILocalized.PushFeedbackShort}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </UIGridColumn>
                </UIGrid>
                {this.props.closable &&
                    <UILink
                        textAlign={UILink.TextAlign.Right}
                        icon={icoClose}
                        onPress={this.onClose}
                        buttonSize={UILink.Size.Small}
                        style={styles.closeButton}
                    />}
            </View>
        );
    }
}
