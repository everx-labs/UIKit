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
    onError?: (error: any) => void;
};

export type Dimensions = {
    width: number;
    height: number;
};

export type VideoProps = UIVideoProps & Dimensions;

export type UIVideoResizeMode = 'contain' | 'cover';
