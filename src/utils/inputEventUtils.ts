export function isInputElement(target : HTMLElement) {
    return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
    );
}

export function isSpecialCombination(event: KeyboardEvent) {
    return event.ctrlKey;
}