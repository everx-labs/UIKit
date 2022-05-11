import * as React from 'react';

export function useHasSeveralLinesInInput() {
    const [hasSeveralLinesInInput, setHasSeveralLinesInInput] = React.useState(false);

    const onNumberOfLinesChange = React.useCallback(
        function onNumberOfLinesChange(numberOfLines: number): void {
            if (!hasSeveralLinesInInput && numberOfLines > 1) {
                setHasSeveralLinesInInput(true);
            }
            if (hasSeveralLinesInInput && numberOfLines <= 1) {
                setHasSeveralLinesInInput(true);
            }
            setHasSeveralLinesInInput(false);
        },
        [hasSeveralLinesInInput],
    );

    return {
        onNumberOfLinesChange,
        hasSeveralLinesInInput,
    };
}
