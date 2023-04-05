import { InputMessageType } from '../../Common';
import { UIAmountInputMessageType } from '../types';

export function useInputMessageType(messageType: UIAmountInputMessageType): InputMessageType {
    switch (messageType) {
        case UIAmountInputMessageType.Error:
            return InputMessageType.Error;
        case UIAmountInputMessageType.Warning:
            return InputMessageType.Warning;
        case UIAmountInputMessageType.Success:
            return InputMessageType.Success;
        case UIAmountInputMessageType.Info:
        default:
            return InputMessageType.Info;
    }
}
