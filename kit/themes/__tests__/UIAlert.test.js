import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { render } from '@testing-library/react-native';
import { UILabel } from '../src/UILabel';

test('simple example', () => {
    const { queryByTestId } = render(<UILabel testID="label" />);
    expect(queryByTestId('label')).toBeEnabled();
});

test('simple example 2', () => {
    const { queryByTestId } = render(<UILabel disabled testID="label" />);
    expect(queryByTestId('label')).toBeDisabled();
});
