// @flow
export default class UIEventHelper {
    static checkEventTarget(e: any, className: string) {
        const triggers = Array.from(document.getElementsByClassName(className));
        if (triggers && triggers.length) {
            return triggers.reduce((contains, trigger) => {
                if (!contains) {
                    return trigger.contains(e.target);
                }
                return contains;
            }, false);
        }
        return false;
    }
}
