
import { useListTags } from '@api/tags/tags';

import { APP_CONFIG } from '@/config';

import { toCssClass, toTagCategory } from '@/utils/tagCategoryHelpers';

import './TagsView.css';
import '@styles/tags.css';
import { useContext } from 'react';
import { SearchContext } from '@comp/SearchQueryState/SearchQueryState';


export function TagsView() {

  const { page } = useContext(SearchContext);
  
  const itemsPerPage = APP_CONFIG.tagsViewRows * APP_CONFIG.tagsViewItemsPerRow;
  const request = { 
    Skip: (page - 1)  * itemsPerPage,
    Take: itemsPerPage,
  }

  const pagedTagsResponse = useListTags(request)
  const pagedTags = pagedTagsResponse.data;

  return (
    <div className="tag-list">
      {pagedTags && pagedTags.items && 
        (pagedTags.items.map((tag) => (
          <span className="tag" key={tag.id}>
            <span className={`tag-name tag-type ${toCssClass(toTagCategory(tag.category))}`}>{tag.name}</span>
            <span className="tag-count">{tag.occurrences}</span>
          </span>
        )
      ))}
    </div>
  );
}
