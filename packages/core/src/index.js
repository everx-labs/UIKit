// @flow
import './configs';

export { default as UIColor } from './UIColor';
export { default as UIColorPalette } from './UIColor/UIColorPalette';
export { default as UIConstant } from './UIConstant';
export { default as UIDevice } from './UIDevice';
export { default as UIEventHelper } from './UIEventHelper';
export { default as UIFont } from './UIFont';
export { default as UIFunction } from './UIFunction';
export {
    default as UILocalized,
    UILocalizedService,
    languagesInfo,
    prepareLocales,
    prepareImages,
    prepare,
    formatTime,
    formatDate,
} from './UILocalized';
export { default as UIStyle } from './UIStyle';
export { default as UIStyleColor } from './UIStyle/UIStyleColor';
export { default as UITextStyle } from './UITextStyle';

export type * from '../types';
