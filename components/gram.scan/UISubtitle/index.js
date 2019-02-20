import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';

const styles = StyleSheet.create({
    container: {
        height: UIConstant.bigCellHeight(),
    },
});

class UISubtitle extends UIComponent {
    render() {
        return (
            <View style={[
                UIStyle.centerLeftContainer,
                UIStyle.marginTopHuge,
                styles.container,
            ]}
            >
                <Text style={UITextStyle.primaryAccentBold}>
                    {this.props.value}
                </Text>
            </View>
        );
    }
}

export default UISubtitle;

UISubtitle.defaultProps = {
    value: '',
};
