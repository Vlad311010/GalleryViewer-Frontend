import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useSearchTags } from "@/contract/tags/tags";
import type { TagSearchResponseModel } from "@/contract/model";
import { APP_CONFIG } from "@/config";
import { CONSTANTS } from "@/Constants";

import {
  getCurrentWord,
  replaceCurrentWord,
  type CurrentWord,
} from "@/utils/getCurrentWord";

import type { SelectedTag } from "@/models/searchTag";
import { isInputElement, isSpecialCombination } from "@/utils/inputEventUtils";

export type useTagSearchInputProps = {
  value: string;
  setValue: (value: string) => void;
  
  onSubmit: (value: string) => void;
  enableFocusShortcut?: boolean;
};

export function useTagSearchInput({
  value,
  setValue,
  onSubmit,
  enableFocusShortcut = true,
}: useTagSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  // const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);

  const currentWord = getCurrentWord(value, cursorPosition);

  const { suggestions, isFetching } = useTagSearch(currentWord.value);

  useInputFocusNavigation(inputRef, enableFocusShortcut);

  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [value]);

  useLayoutEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.selectionStart = cursorPosition;
  }, [value, cursorPosition]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setCursorPosition(event.currentTarget.selectionStart ?? 0);
  };

  const handleSelect = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    setCursorPosition(input.selectionStart ?? 0);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    handleSpecialKeys(event);

    handleAutocompleteNavigation(event);
  };

  const handleSpecialKeys = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    switch (event.code) {
      case "Home":
      case "End":
        requestAnimationFrame(() => {
          setCursorPosition(inputRef.current?.selectionStart ?? 0);
        });
        break;

      case "Escape":
        event.preventDefault();
        inputRef.current?.blur();
        break;
    }
  };

  const handleAutocompleteNavigation = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (suggestions.length === 0) {
      if (event.key === "Enter") {
        onSubmit(value);
      }

      return;
    }

    const maxIndex = suggestions.length - 1;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setSelectedSuggestionIndex((index) =>
          index >= maxIndex ? 0 : index + 1,
        );
        break;

      case "ArrowUp":
        event.preventDefault();

        setSelectedSuggestionIndex((index) =>
          index === -1 || index <= 0
            ? maxIndex
            : index - 1,
        );
        break;

      case "Enter":
        event.preventDefault();

        if (selectedSuggestionIndex === -1) {
          onSubmit(value);
          return;
        }

        selectSuggestion(
          suggestions[selectedSuggestionIndex],
          currentWord,
        );
        break;

      case "Escape":
        event.preventDefault();
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const selectSuggestion = (
    suggestion: TagSearchResponseModel,
    word: CurrentWord,
  ) => {
    const {
      value: newInputValue,
      cursorPosition: newCursorPosition,
    } = replaceCurrentWord(
      value,
      word,
      suggestion.name.replaceAll(
        CONSTANTS.SPACE_CHARACTER,
        CONSTANTS.TAG_SEPARATOR_CHARACTER,
      ),
    );

    setValue(newInputValue);
    setCursorPosition(newCursorPosition);

    /*setSelectedTags((tags) => [
      ...tags,
      {
        name: suggestion.name,
        exclude: word.hasExclusionPrefix,
      },
    ]);*/
  };

  return {
    inputRef,

    cursorPosition,
    isFocused,
    isFetching,

    currentWord,
    suggestions,
    selectedSuggestionIndex,
    // selectedTags,

    showHints:
      isFocused && suggestions.length > 0,

    handleChange,
    handleSelect,
    handleFocus,
    handleBlur,
    handleKeyDown,
  };
}

function useTagSearch(searchValue: string) {
  const { data: response, isFetching } =
    useSearchTags(
      {
        value: searchValue,
        take: APP_CONFIG.tagSearchFetchLimit,
      },
      {
        query: {
          enabled: searchValue.length >= 2,
        },
      },
    );

  return {
    suggestions: response?.data ?? [],
    isFetching,
  };
}

function useInputFocusNavigation(
  inputRef: React.RefObject<HTMLInputElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (isInputElement(target) || isSpecialCombination(event)) {
        return;
      } 

      if (event.code === "KeyQ") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, inputRef]);
}