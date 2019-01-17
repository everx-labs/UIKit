// @flow
import React, { Component } from 'react';
import type { Node } from 'react';

type StateUpdate<State, Props> = ((State, Props) => $Shape<State> | void);

export default class UIComponent<Props, State> extends Component<Props, State> {
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setStateSafely(
        state: $Shape<State> | StateUpdate<State, Props>,
        callback?: () => mixed,
    ) {
        if (!this.mounted) {
            return;
        }
        this.setState(state, callback);
    }

    mounted: boolean;

    render(): ?Node {
        return null;
    }
}
