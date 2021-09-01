export type ScrollHandlerContext = {
    scrollTouchGuard: boolean;
    continueResetOnMomentumEnd: boolean;
    lastApproximateVelocity: number;
    lastEndTimestamp: number;
    lastMomentumTimestamp: number;
};
