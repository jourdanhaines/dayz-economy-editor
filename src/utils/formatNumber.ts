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

export function generateRGBHexFromLargeNumber(number: number) {
    const r = Math.floor((number / 1000000) % 255);
    const g = Math.floor((number / 1000) % 255);
    const b = Math.floor(number % 255);

    // Convert each to hex
    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");

    return `#${rHex}${gHex}${bHex}`;
}
