import * as React from 'react';
import { Easing, makeMutable, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

export enum SkeletonProgress {
    Start = 0,
    End = 1,
}

/**
 * Skeletons animation looks nice when all boxes
 * are in sync in terms of animation,
 * therefore make it rely on one `SharedValue`
 */
class SkeletonsChoreographer {
    progress = makeMutable(SkeletonProgress.Start);

    private activeIDs = new Set();

    show(id: number) {
        const wasInactive = this.activeIDs.size === 0;
        this.activeIDs.add(id);

        if (wasInactive) {
            this.progress.value = withRepeat(
                withDelay(
                    500,
                    withTiming(SkeletonProgress.End, { duration: 1500, easing: Easing.linear }),
                ),
                // to run it forever
                // https://docs.swmansion.com/react-native-reanimated/docs/2.3.0-alpha.2/api/withRepeat#numberofreps-number-default-2
                -1,
            );
        }
    }

    hide(id: number) {
        this.activeIDs.delete(id);

        if (this.activeIDs.size === 0) {
            // It will end animation
            this.progress.value = SkeletonProgress.Start;
        }
    }

    private static sharedInstance?: SkeletonsChoreographer;

    static get shared() {
        if (this.sharedInstance == null) {
            this.sharedInstance = new SkeletonsChoreographer();
        }

        return this.sharedInstance;
    }
}

// Unique id
let uid = 0;

export function useSkeletonProgress() {
    const uidRef = React.useRef<number>(0);
    if (uidRef.current === 0) {
        uid += 1;
        uidRef.current = uid;
    }

    const { progress } = SkeletonsChoreographer.shared;

    React.useEffect(() => {
        SkeletonsChoreographer.shared.show(uidRef.current);
        return () => {
            SkeletonsChoreographer.shared.hide(uidRef.current);
        };
    }, []);

    return progress;
}
