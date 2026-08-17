

import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './SearchBar.css';
import { useSearchTags } from '@/contract/tags/tags';
import { getCurrentWord, replaceCurrentWord, type CurrentWord } from './getCurrentWord';
import type { TagSearchResponseModel } from '@/contract/model';
import { CONSTANTS } from '@/Constants';
import { APP_CONFIG } from '@/config';
import type { SelectedTag } from '@/models/searchTag';
import { SearchContext } from '@comp/SearchQueryState/SearchQueryState';

export function SearchBar() {
    
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteListRef = useRef<HTMLUListElement>(null);
    
    const { searchQuery, setSearchQuery } = useContext(SearchContext)

    const [value, setValue] = useState(searchQuery);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedTags, setSelectedTagIds] = useState<SelectedTag[]>([]);

    useInputFocusNavigation(inputRef);

    const currentWord = getCurrentWord(
      value,
      cursorPosition,
    );

    // console.log(selectedTags);

    let { suggestions } = useTagSearch(currentWord.value);

    useEffect(() => {
      setSelectedSuggestionIndex(-1);
    }, [value]);

    useLayoutEffect(() => { // input cursor position synchronization for setCursorPosition()
      if (cursorPosition === null || !inputRef.current) {
        return;
      }

      inputRef.current.selectionStart = cursorPosition;
      //inputRef.current.selectionEnd = cursorPosition;
    }, [value, cursorPosition]);


    const showHints = isFocused && suggestions!.length > 0;

    return (
    <div className="tag-search-container">
      <input 
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);      
          setCursorPosition(e.currentTarget.selectionStart ?? 0);
        }}
        onSelect= {(e) => {
          setCursorPosition(e.currentTarget.selectionStart ?? 0);
        }}
        onKeyDown={(e) => {
          inputHandleSpecialKeys(e, setCursorPosition, inputRef);
          autocompleteNavigation(
            e, 
            suggestions,
            currentWord,
            selectedSuggestionIndex,
            setSelectedSuggestionIndex,
            value,
            setValue,
            setCursorPosition,
            setSelectedTagIds,
            setSearchQuery
          );
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}

        className="tag-search"
        type="search"
        placeholder="Search..."
      />

     
      {showHints && (
        <ul ref={autocompleteListRef} className="tag-search-hints">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              className={
                index === selectedSuggestionIndex
                  ? "tag-search-hint tag-search-hint-active"
                  : "tag-search-hint"
              }
            >
              <span className="tag-search-hint-name">
                {suggestion.name}
              </span>

              <span className="tag-search-hint-occurrences">
                {suggestion.occurrences}
              </span>
            </li>
          ))}
        </ul>
    )}
  </div>
  )
}


function useTagSearch(searchValue : string) {
  const {
    data: response,
    isFetching,
  } = useSearchTags({value: searchValue, take: APP_CONFIG.tagSearchFetchLimit}, { query: { enabled: searchValue.length >= 2 }});

  return {
    suggestions : response?.data ?? [],
    isFetching,
  };
}

const inputHandleSpecialKeys = (
  e: React.KeyboardEvent<HTMLInputElement>, 
  setCursorPosition : React.Dispatch<React.SetStateAction<number>>,
  inputRef: React.RefObject<HTMLInputElement | null>
) => {
  const keyCode = e.code;
  
  switch (keyCode) {
    case "Home":
    case "End":
      requestAnimationFrame(() => {
        setCursorPosition(inputRef.current?.selectionStart ?? 0);
      });
      return;

    case "Escape":
      e.preventDefault();
      inputRef.current?.blur();
      break;
  }
};

const autocompleteNavigation = (
  event: React.KeyboardEvent<HTMLInputElement>,

  suggestions: TagSearchResponseModel[],

  currentWord: CurrentWord,

  selectedSuggestionIndex: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,

  inputValue: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,

  setCursorPosition: React.Dispatch<React.SetStateAction<number>>,

  setSelectedTags: React.Dispatch<React.SetStateAction<SelectedTag[]>>,
  setSearchQuery: (value: string) => void

) => {

  const minIndex = 0;
  const maxIndex = suggestions.length - 1;
  switch (event.key) {

    case "ArrowDown":
      event.preventDefault();
      setSelectedIndex((index) =>
        index >= maxIndex ? minIndex : index + 1
      );
      break;

    case "ArrowUp":
      event.preventDefault();
      if (selectedSuggestionIndex === -1) {
        setSelectedIndex(maxIndex);
      }
      else {
        setSelectedIndex((index) =>
          index <= minIndex ? maxIndex : index - 1
        );
      }
      break;

    case "Enter":
      if (selectedSuggestionIndex === -1) {        
        setSearchQuery(inputValue);
        break;
      }

      if (!suggestions || suggestions.length === 0) {
        return;
      }
        
      const { value: newInputValue, cursorPosition: inputCursoPosition } = replaceCurrentWord(
        inputValue,
        currentWord, 
        suggestions[selectedSuggestionIndex].name.replaceAll(CONSTANTS.SPACE_CHARACTER, CONSTANTS.TAG_SEPARATOR_CHARACTER)
      );

      setValue(newInputValue);
      setCursorPosition(inputCursoPosition);
      setSelectedTags((tags) => {
        const tagToAdd = { 
          name: suggestions[selectedSuggestionIndex].name,
          exclude: currentWord.hasExclusionPrefix,
        };

        return [...tags, tagToAdd];
      });
      break;

    case "Escape":
      event.preventDefault();
      setSelectedIndex(-1);
      break;
  }
};

function useInputFocusNavigation(inputRef : React.RefObject<HTMLInputElement | null>) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;

            if (!inputRef || !inputRef.current ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }

            switch (event.code) {
                case "KeyQ":
                  event.preventDefault();
                  inputRef.current.focus();
                  break;  
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
}