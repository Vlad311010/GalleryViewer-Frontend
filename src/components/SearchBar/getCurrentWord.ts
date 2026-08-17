import { CONSTANTS } from "@/Constants";

export interface CurrentWord {
  value: string;
  start: number;
  end: number;
  hasExclusionPrefix: boolean;
}

export function getCurrentWord(
  value: string,
  cursorPosition: number,
): CurrentWord {
  let start = cursorPosition;

  while (start > 0 && value[start - 1] !== " ") {
    start--;
  }

  let end = cursorPosition;

  while (end < value.length && value[end] !== " ") {
    end++;
  }

  let hasExclusionPrefix = false;
  if (value[start] === CONSTANTS.TAG_EXCLUSION_CHARACTER) {
    start++;
    hasExclusionPrefix = true;
  }

  return {
    value: value.slice(start, end),
    start,
    end,
    hasExclusionPrefix
  };
}

export function replaceCurrentWord(
  inputValue: string,
  word: CurrentWord,
  replacement: string,
): {
  value: string;
  cursorPosition: number;
} {
  const newInputValue =
    inputValue.slice(0, word.start) +
    replacement +
    inputValue.slice(word.end) + 
    CONSTANTS.SPACE_CHARACTER;

  return {
    value: newInputValue,
    cursorPosition: word.start + replacement.length + 1,
  };
}