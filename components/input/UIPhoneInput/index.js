// @flow
import UIDetailsInput from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';

type Props = {};
type State = {};

export default class UIPhoneInput extends UIDetailsInput<Props, State> {
    isSubmitDisabled() {
        const { value } = this.props;
        return !UIFunction.numericText(value);
    }

    keyboardType() {
        return 'phone-pad';
    }

    placeholder() {
        return this.props.placeholder || UILocalized.Phone;
    }

    onChangeText(text: string) {
        const { onChangeText } = this.props;
        if (onChangeText) {
            const input = UIFunction.formatPhoneText(text);
            onChangeText(input);
        }
    }
}
