export function replaceLast(text: string, textToReplace: string, newValue: string): string {
    let textToReplaceLastIndex = text.lastIndexOf(textToReplace);

    return text.substring(0, textToReplaceLastIndex) + newValue;
}