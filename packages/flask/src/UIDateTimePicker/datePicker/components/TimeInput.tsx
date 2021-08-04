import React, { useEffect } from 'react';

export const TimeInput = ({
    onChange,
    current,
}: {
    onChange: any;
    current: any;
}) => {
    const inputRef = React.useRef(null);

    const [time, setTime] = React.useState('');

    useEffect(() => {
        setTimeout(() => {
            /**
             * fast autofocus on load affects the height of the parent element, so we have to use a timeout to wait for the parent animation
             */
            // @ts-expect-error
            inputRef.current.focus();
        }, 500);
    }, []);

    const onChangeHandler = React.useCallback(
        (val: string) => {
            if (val) {
                const today = new Date();
                const newTimeArray = val.split(':');
                const hour = Number(newTimeArray[0]);
                const minute = Number(newTimeArray[1]);
                const newTime = new Date(today.setHours(hour, minute, 0));
                setTime(val);
                onChange(newTime);
            }
        },
        [onChange],
    );

    const inputStyle = {
        marginBottom: 40,
        marginTop: 40,
        textAlign: 'center',
        fontSize: 35,
        height: 50,
        width: 160,
        alignSelf: 'center',
        border: 'none', // remove useless border in web input
    };

    const inputOptions = {
        ref: inputRef,
        style: inputStyle,
        name: 'time',
        type: 'time',
        value: time || current, // current time or empty on mount
        autoFocus: false,
        onChange: (e: { target: { value: string } }) =>
            onChangeHandler(e.target.value), // its can return value only on end input, '' or '00:00'
    };

    // We are have to use React element input here because of broken timepicker flatlist in web.
    // Also web input have useful props like type: 'time' that use mask 00:00, dropdown lists for hours and minutes.
    // So it was useful element for faster develop of TimePicker ???
    return React.createElement('input', inputOptions);
};
