import * as React from 'react';
import { UIMsgButtonCornerPosition } from '../constants';

export function useCornerStyle(cornerPosition: UIMsgButtonCornerPosition | undefined) {
    return React.useMemo(() => {
        switch (cornerPosition) {
            case UIMsgButtonCornerPosition.TopLeft:
                return {
                    borderTopLeftRadius: 0,
                };
            case UIMsgButtonCornerPosition.TopRight:
                return {
                    borderTopRightRadius: 0,
                };
            case UIMsgButtonCornerPosition.BottomLeft:
                return {
                    borderBottomLeftRadius: 0,
                };
            case UIMsgButtonCornerPosition.BottomRight:
                return {
                    borderBottomRightRadius: 0,
                };
            default:
                return null;
        }
    }, [cornerPosition]);
}
