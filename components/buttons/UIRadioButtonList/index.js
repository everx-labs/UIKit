import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View } from 'react-native';

import UIRadioButtonItem from './UIRadioButtonItem';
import UIComponent from '../../UIComponent';
import UIStyle from '../../../helpers/UIStyle';

class UIRadioButtonList extends UIComponent {
    renderRadioItem(item, index) {
        const { selected } = this.props.state;
        return (
            <UIRadioButtonItem
                title={item.title}
                selected={selected === index}
                onPress={() => this.props.onSelect(index)}
            />
        );
    }

    renderList() {
        const { radiobuttonList } = this.props.state;
        return radiobuttonList.map((item, index) => {
            const itemStyle = this.props.flexDirection === 'row' ? UIStyle.marginRightHuge : null;
            return (
                <View
                    key={`radioButton-item-${Math.random()}-${item}`}
                    style={itemStyle}
                >
                    {this.renderRadioItem(item, index)}
                </View>
            );
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
