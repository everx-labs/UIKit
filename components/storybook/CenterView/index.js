// @flow
import React from 'react';
import { View, ScrollView } from 'react-native';
import { UIStyle, UIGrid, UIGridColumn } from '../../../UIKit';

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
            <View medium={2} />
            <View medium={4}>
                <ScrollView
                    style={[
                        UIStyle.Width.full(),
                        UIStyle.Padding.default(),
                    ]}
                >
                    {props.children}
                </ScrollView>
            </View>
            <View medium={2} />
        </UIGrid>
    );
};

export default CenterView;
