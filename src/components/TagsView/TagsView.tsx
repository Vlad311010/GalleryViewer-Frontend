
import { useListTags } from '@api/tags/tags';

import { usePage } from '@/hooks/usePage';
import { APP_CONFIG } from '@/config';

import { toCssClass, toTagCategory } from '@/utils/tagCategoryHelpers';

import './TagsView.css';
import '@styles/tags.css';

/*type TagsViewProps = {
  tags: Tag[];
};*/

// export function TagsView({ tags }: TagsViewProps) {
export function TagsView() {

  const page = usePage();
  
  const itemsPerPage = APP_CONFIG.tagsViewRows * APP_CONFIG.tagsViewItemsPerRow;
  const request = { 
    Skip: (page - 1)  * itemsPerPage,
    Take: itemsPerPage,
  }

  const { data: pagedTags, isLoading, error } = useListTags(request)
  
  return (
    <div className="tag-list">
      {pagedTags?.data.items.map((tag) => (
        <span className="tag" key={tag.id}>
          <span className={`tag-name tag-type ${toCssClass(toTagCategory(tag.category))}`}>{tag.name}</span>
          <span className="tag-count">{tag.occurrences}</span>
        </span>
      ))}
    </div>
  );
}
