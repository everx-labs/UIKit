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
     * Determine whether to repeat the video when the end is reached
     * `false` by default
     */
    repeat?: boolean;
    /**
     * Determines whether the video is on pause
     * `false` by default
     */
    paused?: boolean;
    /**
     * Determines whether sound is being played
     * `false` by default
     */
    muted?: boolean;
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
     * By analogy with the Image#resizeMode
     * `contain` by default
     */
    resizeMode?: UIVideoResizeMode;
    /**
     * Callback function that is called when the media is loaded and ready to play
     */
    onLoad?: () => void;
    /**
     * Callback function that is called when video cannot be loaded
     */
    onError?: () => void;
};

export type Dimensions = {
    width?: number;
    height?: number;
};

export type UIVideoResizeMode = 'contain' | 'cover';
