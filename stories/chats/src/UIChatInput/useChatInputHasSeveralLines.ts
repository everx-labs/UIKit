import * as React from 'react';

export function useChatInputHasSeveralLines() {
    const [hasInputSeveralLines, setHasInputSeveralLines] = React.useState(false);

    const onNumberOfLinesChange = React.useCallback(
        function onNumberOfLinesChange(numberOfLines: number): void {
            if (!hasInputSeveralLines && numberOfLines > 1) {
                setHasInputSeveralLines(true);
            }
            if (hasInputSeveralLines && numberOfLines <= 1) {
                setHasInputSeveralLines(true);
            }
            setHasInputSeveralLines(false);
        },
        [hasInputSeveralLines],
    );

    return {
        onNumberOfLinesChange,
        hasInputSeveralLines,
    };
}
