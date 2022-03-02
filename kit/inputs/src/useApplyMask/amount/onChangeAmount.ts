import { runOnUI, SharedValue } from 'react-native-reanimated';
import { uiLocalized } from '@tonlabs/localization';
import { runUIOnChangeAmount } from './runUIOnChangeAmount';
import type { ChangeText, MoveCarret } from '../../UIMaterialTextView/types';

export function onChangeAmount(
    rawNumber: string,
    selectionStart: SharedValue<number>,
    selectionEnd: SharedValue<number>,
    lastNormalizedText: SharedValue<string>,
    lastText: SharedValue<string>,
    changeText: ChangeText,
    moveCarret: MoveCarret,
    skipNextOnSelectionChange: SharedValue<boolean>,
) {
    const {
        grouping: integerSeparator,
        decimal: delimeter,
        decimalGrouping: fractionalSeparator,
    } = uiLocalized.localeInfo.numbers;

    const inputSeparators = [',', '.', '/', 'б', 'ю'];

    runOnUI(runUIOnChangeAmount)(
        rawNumber,
        selectionStart,
        selectionEnd,
        integerSeparator,
        delimeter,
        fractionalSeparator,
        lastNormalizedText,
        lastText,
        changeText,
        moveCarret,
        skipNextOnSelectionChange,
        inputSeparators,
    );
}
