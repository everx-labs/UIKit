// This is for future fixing animation bugs and other bugs in popup-dialog
// maybe need to replace popup-dialog on this component in fullscreen mode
// @flow
// import React from 'react';
// import { View } from 'react-native';
//
// import UIComponent from '../../components/UIComponent';
// import UIStyle from '../../helpers/UIStyle';
//
// export default class UIFullScreenDialog extends UIComponent {
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             visible: false,
//         };
//     }
//
//     // Setters
//     setVisible(visible = true, callback) {
//         this.setStateSafely({ visible }, callback);
//     }
//
//     // Getters
//     isVisible() {
//         return this.state.visible;
//     }
//
//     // Actions
//     show() {
//         this.setVisible(true, this.props.onShown);
//     }
//
//     dismiss() {
//         this.setVisible(false, this.props.onDismissed);
//     }
//
//     render() {
//         if (!this.isVisible()) {
//             return null;
//         }
//
//         const {
//             testID, width, height, containerStyle, dialogStyle, dialogTitle, children, dialogAnimation,
//         } = this.props;
//         console.log(dialogAnimation.animate, dialogAnimation.animations.transform[0]);
//         return (
//             <View
//                 testID={testID}
//                 width={width}
//                 height={height}
//                 style={[containerStyle, dialogStyle, UIStyle.Common.backgroundPrimaryColor()]}
//             >
//                 {dialogTitle}
//                 {children}
//             </View>
//         );
//     }
// }
