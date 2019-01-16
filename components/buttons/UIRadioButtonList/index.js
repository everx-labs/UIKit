import React from 'react';
import PropTypes from 'prop-types';
import StylePropType from 'react-style-proptype';

import { View } from 'react-native';

import UIRadioButtonItem from './UIRadioButtonItem';
import UIComponent from '../../UIComponent';

class UIRadioButtonList extends UIComponent {
    renderList() {
        const { selected, radiobuttonList } = this.props.state;
        return radiobuttonList.map((item, index) => (
            <UIRadioButtonItem
                key={`radioButton~${Math.random()}`}
                title={item.title}
                selected={selected === index}
                onPress={() => this.props.onSelect(index)}
            />
        ));
    }

    render() {
        return (
            <View style={this.props.style}>
                {this.renderList()}
            </View>
        );
    }
}

export default UIRadioButtonList;

UIRadioButtonList.defaultProps = {
    state: {},
    style: {},
    onSelect: () => {},
};

UIRadioButtonList.propTypes = {
    state: PropTypes.instanceOf(Object),
    style: StylePropType,
    onSelect: PropTypes.func,
};
