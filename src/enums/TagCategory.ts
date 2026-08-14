
export type TagCategory = typeof TagCategory[keyof typeof TagCategory];


export const TagCategory = {
  author: 'author',
  character: 'character',
  source: 'source',
  description: 'description',
} as const;