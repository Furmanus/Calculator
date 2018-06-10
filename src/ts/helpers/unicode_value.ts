interface IUnicodeToValueMap {
    [key: string]: string
}
const unicodeToValueMap: IUnicodeToValueMap = {
    '%CF%80': (Math.PI).toString(),
    '%F0%9D%91%92': (Math.E).toString()
};
const stringToDisplayMap: IUnicodeToValueMap = {
    'power': '^('
};

export function unicodeToValue(value: string): string {
    const mapedValue: string = unicodeToValueMap[encodeURI(value)];

    return mapedValue || value;
}