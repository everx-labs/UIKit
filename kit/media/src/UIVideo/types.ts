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
};

export type Dimensions = {
    width?: number;
    height?: number;
};
