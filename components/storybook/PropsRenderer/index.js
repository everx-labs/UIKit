import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { UIConstant, UIColor, UIStyle } from '../../../UIKit';

const SHOW_DEFAULT = true; //

const styles = StyleSheet.create({
    propList: {
        //
    },
    propItem: {
        marginTop: UIConstant.mediumContentOffset(),
    },
});

export default class PropsSection extends React.Component {
    render() {
        if (!this.props.props) return null;

        return (
            <View style={styles.propList}>
                {this.props.props.map((prop, rank) => {
                    return (
                        <View
                            key={`props-${rank}`}
                            style={[
                                rank !== 0 ? styles.propItem : null,
                            ]}
                        >
                            <View style={[
                                UIStyle.Margin.bottomSmall(),
                                UIStyle.Common.flexRow(),
                            ]}
                            >
                                <Text style={[
                                    UIStyle.Text.primarySmallBold(),
                                ]}
                                >
                                    {prop.name}
                                </Text>
                                <Text style={[
                                    UIStyle.Text.secondarySmallRegular(),
                                    UIStyle.Margin.leftSmall(),
                                ]}
                                >
                                    {prop.description}
                                </Text>
                            </View>
                            <View style={UIStyle.Common.flexRow()}>
                                <Text style={UIStyle.Text.secondarySmallRegular()}>type: </Text>
                                <Text style={UIStyle.Text.secondarySmallBold()}>{prop.flowType?.name}</Text>
                            </View>
                            {SHOW_DEFAULT && prop.defaultValue?.value ? <View style={UIStyle.Common.flexRow()}>
                                <Text style={UIStyle.Text.secondarySmallRegular()}>default: </Text>
                                <Text style={UIStyle.Text.secondarySmallBold()}>{prop.defaultValue?.value}</Text>
                            </View> : null}
                        </View>
                    );
                })}
            </View>
        );
    }
}
