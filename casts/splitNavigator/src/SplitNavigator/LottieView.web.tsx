import * as React from 'react';
import lottie, { AnimationItem, AnimationConfigWithData } from 'lottie-web';

class LottieWebView extends React.Component {
    animationContainer = React.createRef<HTMLDivElement>();

    animationInstance = React.createRef<AnimationItem>();

    componentDidMount() {
        if (this.animationContainer.current == null) {
            return;
        }

        this.animationInstance.current?.destroy();

        const config: AnimationConfigWithData = {
            container: this.animationContainer.current,
        };

        this.animationInstance.current = lottie.loadAnimation(config);
    }

    setNativeProps({ style: { progress } }: { style: { progress: number } }) {
        this.animationInstance.current?.goToAndStop(progress);
    }

    render() {
        return <div ref={this.animationContainer} />;
    }
}
