import { TagCategory } from "@/enums/TagCategory";


export function toTagCategory(value: string | undefined): TagCategory | undefined {
  if (!value)
    return undefined;

  value = value.toLowerCase();
  if (Object.values(TagCategory).includes(value as TagCategory)) {
    return value as TagCategory;
  }

  return undefined;
}

export function toCssClass(value: TagCategory | undefined): string {
  if (!value) {
    return '';
  }

  switch (value) {
    case TagCategory.author:
      return 'author-tag';

    case TagCategory.character:
      return 'character-tag';

    case TagCategory.source:
      return 'source-tag';

    case TagCategory.description:
      return 'description-tag';

    default:
      return '';
  }
}