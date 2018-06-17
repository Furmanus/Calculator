export function removeNodeChildren(node: HTMLElement): HTMLElement {
    while (node.hasChildNodes()) {
        node.removeChild(<HTMLElement>node.firstChild);
    }

    return node;
}