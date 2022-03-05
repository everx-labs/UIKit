import * as React from 'react';

export function usePlaceholderVisibility(isExpanded: boolean) {
    const [isPlaceholderVisible, setPlaceholderVisible] = React.useState(isExpanded);

    /**
     * We need to show the placeholder after the expanding animation ends
     */
    const showPlacehoder = React.useCallback(() => {
        setPlaceholderVisible(true);
    }, []);

    React.useEffect(() => {
        /**
         * We need to hide the placeholder before the folding animation starts
         */
        if (!isExpanded) {
            setPlaceholderVisible(false);
        }
    }, [isExpanded]);

    return {
        isPlaceholderVisible,
        showPlacehoder,
        isExpanded,
    };
}
