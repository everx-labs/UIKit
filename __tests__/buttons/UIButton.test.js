import React from 'react';
import { UIButton } from '../../UIKit';
import { render } from '@testing-library/react-native';

test('should render correctly', () => {
    const { baseElement } = render(<UIButton />);
    expect(baseElement).toMatchSnapshot();
});
