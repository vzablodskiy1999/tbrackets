export const generateRandomId = (): string => {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export const isPowOfTwo = (num: number): boolean => {
    let numHolder = num;
    if (numHolder === 0) return false;

    while(Number.isSafeInteger(numHolder / 2)) {
        numHolder = numHolder / 2;
    };

    return numHolder === 1;
}