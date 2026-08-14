import type { TagCategory } from "@/enums/TagCategory";
import { useState } from "react";


import './TagCreation.css';
import '@styles/tags.css';

type TagCreationProps = {
  onCreate: (tag: {
    name: string;
    category: TagCategory;
  }) => void;
};

export function TagCreation({ onCreate }: TagCreationProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TagCategory>("author");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    onCreate({
      name: trimmedName,
      category,
    });

    setName("");
  };

  return (
    <form className="tag-creation" onSubmit={handleSubmit}>
      <div className="tag-input-row">
        <input
          className="tag-input tag-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tag name"
        />

        <select
          className={`tag-input tag-category-input tag-type ${category}-tag`}
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as TagCategory)
          }
        >
          <option className="tag-type author-tag" value="author">Author</option>
          <option className="tag-type character-tag" value="character">Character</option>
          <option className="tag-type copyright-tag" value="copyright">Copyright</option>
          <option className="tag-type description-tag" value="description">Description</option>
        </select>
      </div>

      <button className="tag-create-button" type="submit">
        Create
      </button>
    </form>
  );
}