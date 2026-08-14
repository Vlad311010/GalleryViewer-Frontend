import { useListItems } from '@api/asset-browser/asset-browser.ts';
import type { ListItemsParams } from  '@api/model/listItemsParams';

import { ItemsGrid } from '@comp/ItemsGrid/ItemsGrid';

import { APP_CONFIG } from "@/config";

import './Gallery.css'

type GalleryProps = {
  identifier: string;
  page: number;
};

export function Gallery({ identifier, page } : GalleryProps ) {

  const itemsPerPage = APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows
  const filterParams: ListItemsParams = { 
    Skip: (page - 1)  * itemsPerPage,
    Take: itemsPerPage,
  }
  
  const { data, isLoading, error } = useListItems(filterParams);

  if (!data) {
    return <h3>Loading</h3>;
  }

  return (<>
    
    <ItemsGrid 
      items = {data.data.items}
      page = {page}
      totalPages = {data.data.pagesCount as number}
    /> 

  </>);
}

