/**
 * UIVideo properties
 */
export type UIVideoProps = {
    /**
     * uri link to the video
     */
    uri: string;
    /**
     * Determines whether to show player controls
     * `false` by default
     */
    controls?: boolean;
    /**
     * Determine whether the audio is muted
     * `false` by default
     */
    muted?: boolean;
    /**
     * Determine whether to repeat the video when the end is reached
     * `false` by default
     */
    repeat?: boolean;
    /**
     * Set the width of the player
     */
    width?: number;
    /**
     * Set the height of the player
     */
    height?: number;
    /**
     * Set the aspectRatio of the player
     */
    aspectRatio?: number;
    /**
     * Callback function that is called when the media is loaded and ready to play
     */
    onLoad?: () => void;
    /**
     * Callback function that is called when video cannot be loaded
     */
    onError?: (error: any) => void;
};

export type Dimensions = {
    width?: number;
    height?: number;
};
