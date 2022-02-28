import * as React from 'react';

import {
    InputAccessoryView,
    // @ts-ignore
    // eslint-disable-next-line import/no-unresolved, import/extensions
} from './InputAccessoryView';
import type { UIInputAccessoryViewProps } from './types';
import { useUIInputAccessoryViewAvailability } from './UIInputAccessoryViewAvailability';

export function UIInputAccessoryView(props: UIInputAccessoryViewProps) {
    const availabilityContext = useUIInputAccessoryViewAvailability();

    React.useEffect(() => {
        if (availabilityContext == null) {
            return undefined;
        }

        availabilityContext.addInputAccessoryView();

        return availabilityContext.removeInputAccessoryView;
    }, [availabilityContext]);

    return React.createElement(InputAccessoryView, props);
}
