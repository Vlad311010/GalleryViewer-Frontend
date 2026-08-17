import { CONSTANTS } from "@/Constants";

export function parseSearchQuery(searchQury: string) {
  const tags = searchQury
    .split(CONSTANTS.SPACE_CHARACTER)
    .map(x => x.trim())
    .filter(Boolean);

  let include : string[] = [];
  let exclude : string[] = [];
  tags.forEach(element => {
    if (element.startsWith(CONSTANTS.TAG_EXCLUSION_CHARACTER)) {
      exclude.push(element.slice(1, element.length));
    }
    else {
      include.push(element);
    }
  });

  return {
    tags: include,
    excludeTags: exclude
  };
}