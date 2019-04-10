// @flow
import UIDetailsInput from '../UIDetailsInput';
import UIFunction from '../../../helpers/UIFunction';
import UILocalized from '../../../helpers/UILocalized';

type Props = {};
type State = {};

export default class UIEmailInput extends UIDetailsInput<Props, State> {
    isSubmitDisabled() {
        const { value } = this.props;
        return !UIFunction.isEmail(value);
    }

    keyboardType() {
        return 'email-address';
    }

    placeholder() {
        return this.props.placeholder || UILocalized.EmailAddress;
    }
}
