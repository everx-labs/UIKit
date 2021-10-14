import * as React from 'react';
import { Text, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * (savelichalex):
 * On web <input /> be default doesn't have intrinsic size
 * unless property `size` is specified, but it also
 * works badly, since it takes "widest" letter from font
 * and uses it to count width, so it looks bad.
 *
 * But as we have to just show numbers, we can easily
 * use regular <Text />.
 *
 * Also as we want to use the component with `useAnimatedProps`
 * we have to specify `setNativeProps` method, and update
 * needed properties directly on DOM node.
 */
class TextInputImitator extends React.Component<TextInput['props']> {
    _ref = React.createRef<HTMLSpanElement>();

    componentDidMount() {
        if (this.props.defaultValue) {
            this.setNativeProps({ style: { text: this.props.defaultValue } });
        }
    }

    /**
     * It's called `text` to be compatible with the native version
     */
    setNativeProps({ style: { text } }: { style: { text: string } }) {
        if (this._ref && 'current' in this._ref && this._ref.current) {
            this._ref.current.textContent = text;
        }
    }

    render() {
        return (
            <Text ref={this._ref as any} style={this.props.style}>
                {this.props.defaultValue}
            </Text>
        );
    }
}

export const AnimatedTextInput = Animated.createAnimatedComponent(TextInputImitator);
