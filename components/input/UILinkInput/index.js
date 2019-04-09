// @flow
import UIDetailsInput from '../UIDetailsInput';

type Props = {};
type State = {};

export default class UILinkInput extends UIDetailsInput<Props, State> {
    keyboardType() {
        return 'url'; // iOS only
    }

    beginningTag() {
        console.log('>>', this.props.beginningTag || 'https://');
        return this.props.beginningTag || 'https://';
    }
}
