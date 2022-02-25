import { runOnUI, SharedValue } from 'react-native-reanimated';
import { uiLocalized } from '@tonlabs/localization';
import { runUIOnChangeAmount } from './runUIOnChangeAmount';
import type { MoveCarret } from './types';

export function onChangeAmount(
    rawNumber: string,
    selectionStart: SharedValue<number>,
    selectionEnd: SharedValue<number>,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
    setText: (formattedNumber: string) => void,
    moveCarret: MoveCarret,
) {
    const {
        grouping: integerSeparator,
        decimal: delimeter,
        decimalGrouping: fractionalSeparator,
    } = uiLocalized.localeInfo.numbers;

    runOnUI(runUIOnChangeAmount)(
        rawNumber,
        selectionStart,
        selectionEnd,
        integerSeparator,
        delimeter,
        fractionalSeparator,
        lastNormalizedText,
        lastText,
        setText,
        moveCarret,
    );
}
