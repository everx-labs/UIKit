import React from 'react';
import { UITextInput } from '../../UIKit';
import { render, fireEvent } from '@testing-library/react-native';
import {View} from "react-native";

const Component = () => {
  const [name, setUser] = React.useState('');

  return (
    <View>
      <UITextInput value={name} onChangeText={setUser}/>
    </View>
  );
};

const testData = [
  ['accept letters and numbers', 'test 123'],
  ['accept unicode symbols', '® ✉ § © ☯ ? $ £'],
  ['accept emoji', '👍👌✨'],
];

test.each(testData)('Should %s',(testName, text) =>{
  const { getByTestId, baseElement } = render(<Component />);

  const inputBefore = getByTestId('uiTextInput');
  fireEvent.changeText(inputBefore, text);

  expect(inputBefore.props.value).toBe(text);
  expect(baseElement).toMatchSnapshot();
});


