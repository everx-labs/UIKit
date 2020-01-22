import React from 'react';
import {UIButton} from '../../UIKit';
import { render } from '@testing-library/react-native';

test('Check UI button snap', () => {
  const { baseElement } = render(<UIButton />);
  expect(baseElement).toMatchSnapshot();
});
