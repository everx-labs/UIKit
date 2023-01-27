import { InputMessageType } from '../../InputMessage';
import { UIAmountInputEnhancedMessageType } from '../types';

export function useInputMessageType(
    messageType: UIAmountInputEnhancedMessageType,
): InputMessageType {
    switch (messageType) {
        case UIAmountInputEnhancedMessageType.Error:
            return InputMessageType.Error;
        case UIAmountInputEnhancedMessageType.Warning:
            return InputMessageType.Warning;
        case UIAmountInputEnhancedMessageType.Success:
            return InputMessageType.Success;
        case UIAmountInputEnhancedMessageType.Info:
        default:
            return InputMessageType.Info;
    }
}
