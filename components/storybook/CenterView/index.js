import React from 'react';
import PropTypes from 'prop-types';
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

export default function CenterView({ children }) {
    return (
        <View style={styles.main}>
            <ScrollView style={[UIStyle.Margin.topMassive(), UIStyle.Width.full(), { padding: 16 }]}>
                {children}
            </ScrollView>
        </View>
    );
}

CenterView.defaultProps = {
    children: null,
};

CenterView.propTypes = {
    children: PropTypes.node,
};
