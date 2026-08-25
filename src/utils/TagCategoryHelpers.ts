import { TagCategory } from "@/enums/TagCategory";


export function toTagCategory(value: string | null): TagCategory | null {
  if (!value)
    return null;

  value = value.toLowerCase();
  if (Object.values(TagCategory).includes(value as TagCategory)) {
    return value as TagCategory;
  }

  return null;
}

export function toCssClass(value: TagCategory | null): string {
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

    case TagCategory.general:
      return 'general-tag';

    default:
      return '';
  }
}