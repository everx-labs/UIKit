// @flow
import React, { Component } from 'react';

type StateUpdate<State, Props> = ((State, Props) => $Shape<State> | void);

export default class UIComponent<Props, State> extends Component<Props, State> {
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setStateSafely(
        state: $Shape<State> | StateUpdate,
        callback?: () => mixed,
    ) {
        if (!this.mounted) {
            return;
        }
        this.setState(state, callback);
    }

    render() {
        return null;
    }
}
