// @flow
import React from 'react';
import { View, ScrollView } from 'react-native';
import { UIStyle } from '../../../UIKit';

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
        <View style={styles.main}>
            <ScrollView
                style={[
                    UIStyle.Margin.topMajor(),
                    UIStyle.Width.full(),
                    UIStyle.Padding.default(),
                ]}
            >
                {props.children}
            </ScrollView>
        </View>
    );
};

export default CenterView;
