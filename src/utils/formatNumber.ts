import numeral from "numeral";

// ----------------------------------------------------------------------

export function fCurrency(number: string | number, digits = 2) {
    let digitString = "";
    for (let i = 0; i < digits; i++) {
        digitString += "0";
    }
    return numeral(number).format(
        Number.isInteger(number) ? "0,0" : "0,0." + digitString
    );
}

export function fCurrencyNoDecimals(number: string | number) {
    return numeral(number).format("0,0");
}

export function fPercent(number: number) {
    return numeral(number / 100).format("0.0%");
}

export function fNumber(number: string | number) {
    return numeral(number).format();
}

export function fShortenNumber(number: string | number) {
    if (!number) return "0";
    return number.toString().startsWith("0")
        ? numeral(number).format("0.00000a").replace(".00000", "")
        : numeral(number).format("0.00a").replace(".00", "");
}

export function fShortenDecimal(number: string | number) {
    return numeral(number).format("0.000a").replace(".000", "");
}

export function fData(number: string | number) {
    return numeral(number).format("0.0 b");
}

export function clamp(number: number, min: number, max: number) {
    return number < min ? min : number > max ? max : number;
}
