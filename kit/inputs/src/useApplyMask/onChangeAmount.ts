import { runOnUI, SharedValue } from 'react-native-reanimated';
import { uiLocalized } from '@tonlabs/localization';
import type { UIMaterialTextViewRef } from '../UIMaterialTextView';
import { runUIOnChangeAmount } from './runUIOnChangeAmount';

export function onChangeAmount(
    rawNumber: string,
    ref: React.RefObject<UIMaterialTextViewRef>,
    selectionStart: SharedValue<number>,
    selectionEnd: SharedValue<number>,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
) {
    const {
        grouping: integerSeparator,
        decimal: delimeter,
        decimalGrouping: fractionalSeparator,
    } = uiLocalized.localeInfo.numbers;

    // TODO
    const formattedNumber;

    runOnUI(runUIOnChangeAmount)(
        rawNumber,
        ref,
        selectionStart,
        selectionEnd,
        integerSeparator,
        delimeter,
        fractionalSeparator,
        lastNormalizedText,
        lastText,
    );
}
