import * as React from 'react';

import {
    InputAccessoryView,
    // @ts-ignore
    // eslint-disable-next-line import/no-unresolved, import/extensions
} from './InputAccessoryView';
import type { UIInputAccessoryViewProps } from './types';

export function UIInputAccessoryView(props: UIInputAccessoryViewProps) {
    return React.createElement(InputAccessoryView, props);
}
