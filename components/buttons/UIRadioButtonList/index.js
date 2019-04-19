import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View } from 'react-native';

import UIRadioButtonItem from './UIRadioButtonItem';
import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';

class UIRadioButtonList extends UIComponent {
    renderList() {
        const { selected, radiobuttonList } = this.props.state;
        return radiobuttonList.map((item, index) => {
            const radioItem = (
                <UIRadioButtonItem
                    key={`radioButton~${Math.random()}`}
                    title={item.title}
                    selected={selected === index}
                    onPress={() => this.props.onSelect(index)}
                />
            );
            if (this.props.flexDirection === 'row') {
                return (
                    <View style={UIStyle.marginRightHuge}>
                        {radioItem}
                    </View>
                );
            }
            return radioItem;
        });
    }

    getFlexDirectionStyle() {
        return this.props.flexDirection === 'row' ? UIStyle.flexRow : null;
    }

    render() {
        const flexDirectionStyle = this.getFlexDirectionStyle();
        return (
            <View style={[flexDirectionStyle, this.props.style]}>
                {this.renderList()}
            </View>
        );
    }
}

export default UIRadioButtonList;

UIRadioButtonList.defaultProps = {
    state: {},
    style: {},
    flexDirection: 'column',
    onSelect: () => {},
};

UIRadioButtonList.propTypes = {
    state: PropTypes.instanceOf(Object),
    style: StylePropType,
    flexDirection: PropTypes.string,
    onSelect: PropTypes.func,
};
