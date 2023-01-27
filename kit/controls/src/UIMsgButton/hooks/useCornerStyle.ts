import * as React from 'react';
import { I18nManager } from 'react-native';
import { UIMsgButtonCornerPosition } from '../constants';

export function useCornerStyle(cornerPosition: UIMsgButtonCornerPosition | undefined) {
    const isRTL = React.useMemo(() => I18nManager.getConstants().isRTL, []);
    return React.useMemo(() => {
        switch (cornerPosition) {
            case UIMsgButtonCornerPosition.TopLeft:
                return isRTL
                    ? {
                          borderTopRightRadius: 0,
                      }
                    : {
                          borderTopLeftRadius: 0,
                      };
            case UIMsgButtonCornerPosition.TopRight:
                return isRTL
                    ? {
                          borderTopLeftRadius: 0,
                      }
                    : {
                          borderTopRightRadius: 0,
                      };
            case UIMsgButtonCornerPosition.BottomLeft:
                return isRTL
                    ? {
                          borderBottomRightRadius: 0,
                      }
                    : {
                          borderBottomLeftRadius: 0,
                      };
            case UIMsgButtonCornerPosition.BottomRight:
                return isRTL
                    ? {
                          borderBottomLeftRadius: 0,
                      }
                    : {
                          borderBottomRightRadius: 0,
                      };
            default:
                return null;
        }
    }, [cornerPosition, isRTL]);
}
