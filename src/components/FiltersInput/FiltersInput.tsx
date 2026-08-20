import { useTagSearchInput, type useTagSearchInputProps } from "@/hooks/useTagSearchInput";

import './FiltersInput.css';
import { toCssClass, toTagCategory } from "@/utils/tagCategoryHelpers";

export function FiltersInput(props: useTagSearchInputProps) {
  const {
    inputRef,
    suggestions,
    selectedSuggestionIndex,
    showHints,
    handleChange,
    handleSelect,
    handleFocus,
    handleBlur,
    handleKeyDown,
  } = {
    ...useTagSearchInput(props),
  };

  return (
    <div className="tag-search-container">
      <input
        id = "tag_search_input"
        autoComplete="off"
        ref={inputRef}
        value={props.value}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="search"
        placeholder="Search..."
        className="tag-search"
      />

      {showHints && (
        <ul className="tag-search-hints">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              className={
                index === selectedSuggestionIndex
                  ? `tag-search-hint tag-search-hint-active tag-type ${toCssClass(toTagCategory(suggestion.category))}`
                  : `tag-search-hint tag-type ${toCssClass(toTagCategory(suggestion.category))}`
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
  );
}