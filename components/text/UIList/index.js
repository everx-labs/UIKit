// Maybe we will need it in future
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
//
// import UIComponent from '../../UIComponent';
// import UILabel from '../UILabel';
// import UIStyle from '../../../helpers/UIStyle';
//
// export default class UIList extends UIComponent {
//     render() {
//         return this.props.listItems.map(item => (
//             <View style={[UIStyle.Common.flexRow(), UIStyle.Margin.topHuge()]}>
//                 <UILabel
//                     style={StyleSheet.flatten([
//                         UIStyle.Margin.leftGreat(), UIStyle.Margin.rightDefault(),
//                     ])}
//                     role={UILabel.Role.BoldDescription}
//                     text="•"
//                 />
//                 {item}
//             </View>
//         ));
//     }
// }
//
// UIList.defaultProps = {
//     listItems: [],
// };
