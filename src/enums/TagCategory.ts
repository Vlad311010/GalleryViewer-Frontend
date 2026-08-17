
export type TagCategory = typeof TagCategory[keyof typeof TagCategory];


export const TagCategory = {
  author: 'author',
  character: 'character',
  source: 'source',
  general: 'general'
} as const;