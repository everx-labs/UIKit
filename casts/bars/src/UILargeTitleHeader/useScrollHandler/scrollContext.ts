// @inline
const SCROLL_NONE = 0;
// @inline
const SCROLL_DRAGGING = 1;
// @inline
const SCROLL_FLING_EMULATED = 2;
// @inline
const SCROLL_FLING_REAL = 3;

type ScrollState = 0 | 1 | 2 | 3;

export type ScrollHandlerContext = {
    lastScrollTimeMs: number;
    velocityY: number;
    state: ScrollState;
};

export function isNoScroll<Context extends { state: ScrollState }>(ctx: Context) {
    'worklet';

    return ctx.state === SCROLL_NONE;
}

export function setNoScroll<Context extends { state: ScrollState }>(ctx: Context) {
    'worklet';

    ctx.state = SCROLL_NONE;
}

export function isDragging<Context extends { state: ScrollState }>(ctx: Context) {
    'worklet';

    return ctx.state === SCROLL_DRAGGING;
}

export function setDragging<Context extends { state: ScrollState }>(ctx: Context) {
    'worklet';

    ctx.state = SCROLL_DRAGGING;
}

export function isFlingEmulated<Context extends { state: ScrollState }>(ctx: Context) {
    'worklet';

    return ctx.state === SCROLL_FLING_EMULATED;
}

export function setFlingEmulated<Context extends { state: ScrollState }>(ctx: Context) {
    'worklet';

    ctx.state = SCROLL_FLING_EMULATED;
}

export function isFlingReal<Context extends { state: ScrollState }>(ctx: Context) {
    'worklet';

    return ctx.state === SCROLL_FLING_REAL;
}

export function setFlingReal<Context extends { state: ScrollState }>(ctx: Context) {
    'worklet';

    ctx.state = SCROLL_FLING_REAL;
}

export function initVelocityTracker<Context extends { lastScrollTimeMs: number }>(ctx: Context) {
    'worklet';

    ctx.lastScrollTimeMs = Date.now();
}

export function trackVelocity<Context extends { lastScrollTimeMs: number; velocityY: number }>(
    diff: number,
    ctx: Context,
) {
    'worklet';

    const now = Date.now();

    if (diff === 0) {
        return;
    }

    const velocityY = diff / (now - ctx.lastScrollTimeMs);

    ctx.velocityY = velocityY;
    ctx.lastScrollTimeMs = now;
}
