const randomInRange = (from: number, to: number, notLower = from, notBigger = to) => {

    let x = Math.random() * (to - from);
    let num = x + from;

    if (notBigger || notLower) {

        while (num > notBigger || num < notLower) {
            num = randomInRange(from, to, notLower, notBigger);
        }

    }

    return num;
}

export default randomInRange;