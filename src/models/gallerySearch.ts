import type { SelectedTag } from "@/models/searchTag";

export interface GallerySearch {
  rawQuery: string;
  tags: SelectedTag[];
}