
export function ease(from: number, to: number, easeNumber = 0.01) {
    return new Promise((res, rej) => {
        easeHelper(res, rej, from, to, easeNumber);
    })
}

function easeHelper(res: Function, rej: Function, from: number, to: number, easeNumber = 0.01, maxIterations = 500) {

    const value = from += easeNumber * (from < to ? 1 : -1);
    maxIterations++;

    if (from === to) {
        res(value);
    } else if (maxIterations) {
        rej(value);
    } else {
        requestAnimationFrame(easeHelper.bind(this, arguments));
    }


}