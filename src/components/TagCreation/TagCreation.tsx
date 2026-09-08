import { TagCategory } from "@/enums/TagCategory";
import { useState } from "react";
import { toTagCategory, toCssClass } from "@/utils/tagCategoryHelpers";
import "@/utils/stringExtensions";

import { toastError, toastPromise, toastSuccess } from "@/utils/toastCreator";
import { tagCreate, } from "@/contract/tags/tags";

import './TagCreation.css';
import '@styles/tags.css';
import type { TagCreateResponseModel } from "@/contract/model";



export function TagCreation() {
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toastError("Tag name can't be empty");
      return;
    }

    const body = {name:trimmedName, category};
    const responsePromise = tagCreate(body);
  
    toastPromise<TagCreateResponseModel>(
      responsePromise,
      (data) => {
          toastSuccess(
            `Created ${data.name}[${data.category}]`
          );
      },
      (err) => toastError(`Failed to create: ${String(err)}`)
    );
  
    setName("");
  };

  const [name, setName] = useState("");
  const [category, setCategory] = useState<TagCategory>("author");


  return (<>
    <title>tag-create</title>
    
    <form name="tag-creation-form" className="tag-creation" onSubmit={handleSubmit}>
      <div className="tag-input-row">
        <input
          name="tag-name-input"
          className="tag-input tag-name-input"
          type="text"
          value={name}
          autoComplete="off"
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

      <button className="button button-sublte" type="submit">
        Create
      </button>
    </form>
  </>);
}