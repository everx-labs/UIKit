import React from 'react';
import { Text, View } from 'react-native';

import UIComponent from '../../UIComponent';
import UIConstant from '../../../helpers/UIConstant';
import UIStyle from '../../../helpers/UIStyle';
import UITextStyle from '../../../helpers/UITextStyle';

class UISubtitle extends UIComponent {
    render() {
        return (
            <View style={[
                UIStyle.centerLeftContainer,
                UIStyle.marginTopHuge,
                { height: UIConstant.bigCellHeight() },
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
