// @flow
import React from 'react';
import { View, ScrollView } from 'react-native';
import { UIStyle, UIGrid, UIGridColumn } from '../../../UIKit';

const styles = {
    main: {
        flex: 1,
    },
};

type Props = {
    children?: React$Node,
}

const FullWidthView = (props: Props) => {
    return (
        <View style={styles.main}>
            <ScrollView
                style={[
                    UIStyle.Width.full(),
                    UIStyle.Height.full(),
                    UIStyle.Padding.default(),
                ]}
            >
                {props.children}
            </ScrollView>
        </View>
    );
};

export default FullWidthView;
