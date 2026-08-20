import { TagCategory } from "@/enums/TagCategory";
import { useState } from "react";
import { toTagCategory, toCssClass } from "@/utils/tagCategoryHelpers";
import "@/utils/stringExtensions";

import { toastError, toastPromise, toastSuccess } from "@/utils/toastCreator";
import { tagCreate } from "@/contract/tags/tags";
import type { tagCreateResponse, tagCreateResponse201 } from '@api/tags/tags';

import './TagCreation.css';
import '@styles/tags.css';



export function TagCreation() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TagCategory>("author");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const body = {name:trimmedName, category};
    const responsePromise = tagCreate(body);
  
    toastPromise<tagCreateResponse>(
      responsePromise,
      (data) => {
        if (data.status === 201) {
          toastSuccess(
            `Created ${data.data.name}[${data.data.category}]`
          );
        }
      },
      (err) => toastError(`Failed to create: ${String(err)}`)
    );
  
    setName("");
  };

  return (
    <form name="tag-creation-form" className="tag-creation" onSubmit={handleSubmit}>
      <div className="tag-input-row">
        <input
          name="tag-name-input"
          className="tag-input tag-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tag name"
        />

        <select
          name="tag-category-input"
          className={`tag-input tag-category-input tag-type ${toCssClass(toTagCategory(category))}`}
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as TagCategory)
          }
        >
          <option className={`tag-type ${toCssClass(TagCategory.author)}`} value={TagCategory.author}>
            {TagCategory.author.capitalize()}
          </option>
          
          <option className={`tag-type ${toCssClass(TagCategory.character)}`} value={TagCategory.character}>
            {TagCategory.character.capitalize()}
          </option>

          <option className={`tag-type ${toCssClass(TagCategory.source)}`} value={TagCategory.source}>
            {TagCategory.source.capitalize()}
          </option>

          <option className={`tag-type ${toCssClass(TagCategory.general)}`} value={TagCategory.general}>
            {TagCategory.general.capitalize()}
          </option>
          
        </select>
      </div>

      <button className="tag-create-button" type="submit">
        Create
      </button>
    </form>
  );
}