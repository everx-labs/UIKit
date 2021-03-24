import * as React from 'react';

export function useHover() {
    const [isHovered, setIsHovered] = React.useState(false);
    const onMouseEnter = React.useCallback(() => {
        setIsHovered(true);
    }, [setIsHovered]);
    const onMouseLeave = React.useCallback(() => {
        setIsHovered(false);
    }, [setIsHovered]);

    return {
        isHovered,
        onMouseEnter,
        onMouseLeave,
    };
}
