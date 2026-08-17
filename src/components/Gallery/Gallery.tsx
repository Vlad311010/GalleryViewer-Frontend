import { useListItems } from '@api/asset-browser/asset-browser.ts';
import type { ListItemsParams } from  '@api/model/listItemsParams';

import { ItemsGrid } from '@comp/ItemsGrid/ItemsGrid';
import { SearchBar } from '@comp/SearchBar/SearchBar';

import { APP_CONFIG } from "@/config";

import './Gallery.css'
import '@styles/tags.css'
import '@styles/buttons.css'
import { useContext } from 'react';
import { SearchContext } from '@comp/SearchQueryState/SearchQueryState';
import { parseSearchQuery } from '../../utils/searchQueryHelpers';


type GalleryProps = {
  identifier: string;
};

export function Gallery({ identifier } : GalleryProps ) {

  const itemsPerPage = APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows;
  const { searchQuery, setSearchQuery, page } = useContext(SearchContext);

  const { tags, excludeTags } = parseSearchQuery(searchQuery);

  const filterParams: ListItemsParams = { 
    Skip: (page - 1)  * itemsPerPage,
    Take: itemsPerPage,
    Tags: tags,
    ExcludeTags: excludeTags
  }
  
  
  const { data, isLoading, error } = useListItems(filterParams);

   
  if (!data) {
    return <h3>Loading</h3>;
  }

  return (<>
    <div className="markdown-toolbar">
      <button className="button button-large">
        ↩ Nav page
      </button>

      <SearchBar />

      <select className="toolbar-select">
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="size">Size</option>
      </select>

      <select className="toolbar-select toolbar-direction">
        <option value="asc">ASC</option>
        <option value="desc">DESC</option>
      </select>
    </div>

    <ItemsGrid 
      items = {data.data.items}
      page = {page}
      totalPages = {data.data.pagesCount as number}
    /> 

  </>);
}

