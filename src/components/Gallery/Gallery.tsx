import { useListItems } from '@api/asset-browser/asset-browser.ts';
import type { ListItemsParams } from  '@api/model/listItemsParams';

import { ItemsGrid } from '@comp/ItemsGrid/ItemsGrid';
import { FiltersInput } from '@/components/FiltersInput/FiltersInput';

import { APP_CONFIG } from "@/config";

import './Gallery.css'
import '@styles/tags.css'
import '@styles/buttons.css'
import { useContext, useState } from 'react';
import { SearchContext } from '@comp/SearchQueryState/SearchQueryState';
import { parseSearchQuery } from '@/utils/searchQueryHelpers';
import { Link } from 'react-router-dom';


type GalleryProps = {
  identifier: string;
};

export function Gallery({ identifier } : GalleryProps ) {

  const itemsPerPage = APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows;
  const { searchQuery, setSearchQuery, page } = useContext(SearchContext);
  
  const { tags, excludeTags } = parseSearchQuery(searchQuery);
  
  const [searchBarValue, setSearchBarValue] = useState(searchQuery);

  const filterParams: ListItemsParams = { 
    Skip: (page - 1)  * itemsPerPage,
    Take: itemsPerPage,
    Tags: tags,
    ExcludeTags: excludeTags
  }
  
  
  const listItemsResponse = useListItems(identifier, filterParams);
  let data = listItemsResponse.data


  return (<>
    <title>{`${identifier}-${page}`}</title>
    <div className="markdown-toolbar">
      <Link to="/" className="button button-neon button-large">
        ↩ Nav page
      </Link>

      <FiltersInput value={searchBarValue} setValue={setSearchBarValue} onSubmit={setSearchQuery} />

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
      items = {data?.items ?? []}
      page = {page}
      totalPages = {data?.pagesCount ?? 0}
    /> 

  </>);
}

