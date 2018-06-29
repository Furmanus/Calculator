export function replaceLast(text: string, textToReplace: string, newValue: string): string {
    let textToReplaceLastIndex: number = text.lastIndexOf(textToReplace);

    return text.substring(0, textToReplaceLastIndex) + newValue;
}
export function replaceNth(num: number, text: string, textToReplace: string, newValue: string): string {
    let nth:number = 0;

    return text.replace(new RegExp(textToReplace, 'g'), function (match) {
        nth++;
        return nth === num ? newValue : match;
    });
}
export function regexLastIndexOf(text: string, regex: RegExp, startpos: number): number {
    let stringToWorkWith: string;
    let lastIndexOf: number;
    let nextStop: number;
    let result: RegExpExecArray | null;
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiline ? "m" : ""));
    if (typeof (startpos) === "undefined") {
        startpos = text.length;
    } else if(startpos < 0) {
        startpos = 0;
    }
    stringToWorkWith = text.substring(0, startpos + 1);
    lastIndexOf = -1;
    nextStop = 0;
    while((result = regex.exec(stringToWorkWith)) !== null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
}