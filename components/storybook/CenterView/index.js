// @flow
import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { UIStyle, UIGrid, UIGridColumn, UIColor } from '../../../UIKit';

const styles = {
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
};

type Props = {
    children?: React$Node,
}

const CenterView = (props: Props) => {
    return (
        <UIGrid>
            <UIGridColumn medium={2} />
            <UIGridColumn medium={4}>
                <ScrollView
                    style={[
                        Platform.OS === 'web' ? null : UIStyle.Margin.topMajor(),
                        UIStyle.Width.full(),
                        UIStyle.Padding.default(),
                        UIStyle.Color.getBackgroundColorStyle(UIColor.whiteLight()),
                    ]}
                >
                    {props.children}
                </ScrollView>
            </UIGridColumn>
            <UIGridColumn medium={2} />
        </UIGrid>
    );
};

export default CenterView;
