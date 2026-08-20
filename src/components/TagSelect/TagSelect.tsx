import { useTagSearchInput, type useTagSearchInputProps } from "@/hooks/useTagSearchInput";

import './TagSelect.css';
import { toCssClass, toTagCategory } from "@/utils/tagCategoryHelpers";

export function TagSelect(props: useTagSearchInputProps) {
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
    <div className="tag-input-container">
      <input
        name="tag-select-input"
        ref={inputRef}
        value={props.value}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="search"
        placeholder="Add tag..."
        className="tag-input"
      />

      {showHints && (
        <ul className="tag-input-hints">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              className={
                index === selectedSuggestionIndex
                  ? "tag-input-hint tag-input-hint-active"
                  : "tag-input-hint"
              }
            >
              <span className={`tag-input-hint-name tag-type ${toCssClass(toTagCategory(suggestion.category))}`}>
                {suggestion.name}
              </span>

              <span className="tag-input-hint-occurrences">
                {suggestion.occurrences}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}