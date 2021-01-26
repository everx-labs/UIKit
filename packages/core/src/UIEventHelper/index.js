// @flow
let prevPath = null;

export default class UIEventHelper {
    static pushHistory(path: string) {
        const { history } = window;
        if (history?.pushState) {
            if (prevPath !== null) {
                history.pushState(null, '', `/${path}`);
            }
            prevPath = path; // Path is already normalized
        }
    }
}
