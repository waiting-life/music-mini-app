export const throttle  = (fn, time = 1000) => {
    let canRun = true;
    return function () {
        if (!canRun) return false;
        canRun = false;
        setTimeout(() => {
            fn.call(this)
            canRun = true
        }, time)
    }
}
