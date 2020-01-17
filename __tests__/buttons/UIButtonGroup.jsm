import React from 'react';
import { UIButtonGroup } from '../../UIKit';
import { render, fireEvent, wait } from '@testing-library/react-native';

// const setup = () => {
//   const utils = render(<UIButtonUIButton />);
//   const input = utils.getByLabelText('cost-input');
//   return {
//     input,
//     ...utils,
//   };
// };

test('It should keep a $ in front of the input', () => {
  const { getByTestId, getByText, queryByTestId, baseElement } = render(<UIButtonGroup />);
  const input = getByTestId('uiButton');

  fireEvent.change(input, { nativeEvent: { text: 23 } });
  expect(input.props.value).toBe('$23');
});



// test('It should allow a $ to be in the input when the value is changed', () => {
//   const { input } = setup();
//   fireEvent.change(input, { nativeEvent: { text: '$23.0' } });
//   expect(input.props.value).toBe('$23.0');
// });

// test('It should not allow letters to be inputted', () => {
//   const { input } = setup();
//   expect(input.props.value).toBe('');
//   fireEvent.change(input, { nativeEvent: { text: 'Good Day' } });
//   expect(input.props.value).toBe('');
// });

// test('It should allow the $ to be deleted', () => {
//   const { input } = setup();
//   fireEvent.change(input, { nativeEvent: { text: '23' } });
//   expect(input.props.value).toBe('$23');
//   fireEvent.change(input, { nativeEvent: { text: '' } });
//   expect(input.props.value).toBe('');
// });