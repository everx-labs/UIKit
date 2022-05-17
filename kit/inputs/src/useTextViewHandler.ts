import type {
    TextInputChangeEventData,
    TextInputFocusEventData,
    TextInputSelectionChangeEventData,
} from 'react-native';
import { useEvent, useHandler } from 'react-native-reanimated';

export function useTextViewHandler<Context extends Record<string, unknown>>(
    handlers:
        | {
              onFocus?: (evt: TextInputFocusEventData, ctx: Context) => void;
              onBlur?: (evt: TextInputFocusEventData, ctx: Context) => void;
              onChange?: (evt: TextInputChangeEventData, ctx: Context) => void;
              onSelectionChange?: (evt: TextInputSelectionChangeEventData, ctx: Context) => void;
          }
        | ((evt: TextInputChangeEventData) => void),
    dependencies?: Array<unknown>,
) {
    const textViewHandlers = typeof handlers === 'function' ? { onChange: handlers } : handlers;
    const { context, doDependenciesDiffer } = useHandler<any, Context>(
        textViewHandlers,
        dependencies,
    );

    const subscribeForEvent = ['topChange'];
    if (textViewHandlers.onFocus != null) {
        subscribeForEvent.push('topFocus');
    }
    if (textViewHandlers.onBlur != null) {
        subscribeForEvent.push('topBlur');
    }
    if (textViewHandlers.onSelectionChange != null) {
        subscribeForEvent.push('topSelectionChange');
    }

    return {
        onChange: useEvent(
            (event: any) => {
                'worklet';

                const { onFocus, onBlur, onChange, onSelectionChange } = textViewHandlers;

                if (onFocus && event.eventName.endsWith('topFocus')) {
                    onFocus(event, context);
                    return;
                }
                if (onBlur && event.eventName.endsWith('topBlur')) {
                    onBlur(event, context);
                    return;
                }
                if (onChange && event.eventName.endsWith('topChange')) {
                    onChange(event, context);
                    return;
                }
                if (onSelectionChange && event.eventName.endsWith('topSelectionChange')) {
                    onSelectionChange(event, context);
                }
            },
            subscribeForEvent,
            doDependenciesDiffer,
        ),
    };
}
