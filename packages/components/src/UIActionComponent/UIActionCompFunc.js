// @flow
import React, { useRef, useState } from 'react';
import { Platform, TouchableWithoutFeedback, View } from 'react-native';

export type ActionProps = {
    testID?: string,
    disabled?: boolean,
    showIndicator?: boolean,
    onPress?: () => void,
    onMouseEnter?: () => void,
    onMouseLeave?: () => void,
    children?: React$Element<any>,
};

type Props = any & ActionProps;

const UIActionComponent = ({
    testID = '',
    disabled = false,
    showIndicator = false,
    onPress = null,
    children,
    onMouseEnter,
    onMouseLeave,
}: Props) => {
    const [isTapped, setTapped] = useState<boolean>(false);
    const [isHover, setHover] = useState<boolean>(false);
    const childrenRef = useRef(null);

    // Events
    const onPressIn = () => {
        setTapped(true);
        childrenRef.current?.onTappedIn && childrenRef.current.onTappedIn();
    };

    const onPressOut = () => {
        setTapped(false);
        childrenRef.current?.onTappedOut && childrenRef.current.onTappedOut();
    };

    const onPressHandler = () => {
        childrenRef.current?.onPressed && childrenRef.current.onPressed();
        if (onPress) {
            onPress();
        }
    };

    const onMouseEnterHandler = () => {
        setHover(true);
        childrenRef.current?.onEnter && childrenRef.current.onEnter();
        if (onMouseEnter) {
            onMouseEnter();
        }
    };

    const onMouseLeaveHandler = () => {
        setHover(false);
        childrenRef.current?.onLeave && childrenRef.current.onLeave();
        if (onMouseLeave) {
            onMouseLeave();
        }
    };

    const testIDProp = testID ? { testID } : null;

    return (
        <TouchableWithoutFeedback
            {...testIDProp}
            disabled={disabled || showIndicator || !onPress}
            onPress={onPressHandler}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <View onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
                {React.cloneElement(children, {
                    ref: childrenRef,
                    isTapped,
                    isHover,
                    style: [
                        Platform.select({
                            web: {
                                cursor: 'pointer',
                                touchAction: 'manipulation',
                            },
                            default: null,
                        }),
                        children.props.style,
                    ],
                })}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default UIActionComponent;
