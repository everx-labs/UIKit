import type { PressableProps } from '../Pressable';

export interface UIPressableAreaProps extends PressableProps {
    /**
     * Use it to define edge scaling points of events.
     */
    scaleParameters?: UIPressableAreaScaleParameters;
    /**
     * Children of PressableArea.
     */
    children: React.ReactNode;
}

export type UIPressableAreaScaleParameters = {
    /**
     * Scale value in default state (without events)
     */
    initial?: number; // default is 1
    /**
     * Scale value in pressed state
     */
    pressed?: number; // default is 0.95
    /**
     * Scale value in hovered state
     */
    hovered?: number; // default is 1.02
};
