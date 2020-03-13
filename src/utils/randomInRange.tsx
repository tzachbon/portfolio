const randomInRange = (from: number, to: number) => {
    let x = Math.random() * (to - from);

    return x + from;
}

export default randomInRange;