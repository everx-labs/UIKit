import * as React from 'react';
// @ts-ignore
// eslint-disable-next-line import/extensions,import/no-unresolved
import { TimeInput } from './TimeInput';
import type { TimeInputProps } from './types';

export function UITimeInput({onChange, current}: TimeInputProps) {
    return React.createElement(TimeInput, {onChange, current});
}
