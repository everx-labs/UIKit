import React from 'react';
import { UITextInput } from '../../UIKit';
import { render, fireEvent } from '@testing-library/react-native';

const Component = () => {
    const [name, setUser] = React.useState('');
    return (<UITextInput value={name} onChangeText={setUser} />);
};

const testData = [
    ['accept letters and numbers', 'test 123'],
    ['accept unicode symbols', '® ✉ § © ☯ ? $ £'],
    ['accept emoji', '👍👌✨'],
];

test.each(testData)('Should %s', (testName, text) => {
    const { getByTestId, baseElement } = render(<Component />);
    const input = getByTestId('uiTextInput');
    fireEvent.changeText(input, text);

    expect(input.props.value).toBe(text);
    expect(baseElement).toMatchSnapshot();
});

