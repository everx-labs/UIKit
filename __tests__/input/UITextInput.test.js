import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { UITextInput } from '../../UIKit';

const Component = () => {
    const [name, setUser] = React.useState('');
    return <UITextInput value={name} onChangeText={setUser} />;
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
