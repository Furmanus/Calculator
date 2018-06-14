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