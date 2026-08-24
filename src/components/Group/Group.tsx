import { useListGroup } from '@api/asset-browser/asset-browser.ts';
import type { ListGroupParams } from  '@api/model/listGroupParams';


import { APP_CONFIG } from "@/config";
import { ItemsGrid } from '@comp/ItemsGrid/ItemsGrid';
import { useContext } from 'react';
import { SearchContext } from '@comp/SearchQueryState/SearchQueryState';
import { useGroupDetails } from '@/contract/groups/groups';


type GroupProps = {
  identifier: number;
};

export function Group({ identifier } : GroupProps ) {
  const { page } = useContext(SearchContext);
  
  const filterParams: ListGroupParams = { 
    Skip: (page - 1)  * APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows,
    Take: APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows,
  }
  
  const { data, isLoading, error } = useListGroup(identifier, filterParams);
  const { data: groupDetails } = useGroupDetails(identifier);

  console.log(groupDetails);
  if (!data || !groupDetails) {
    return <h3>Loading</h3>;
  }

  return (<>
    
    <ItemsGrid 
      items = {data.data.items ?? []}
      page = {page}
      totalPages = {data.data.pagesCount as number}
      groupData = {{
        id: groupDetails.data.id,
        title: groupDetails.data.title,
        assetsCount: groupDetails.data.assetsCount,
        coverAssetPosition: groupDetails.data.coverAssetPosition,
        assetPositions: groupDetails.data.positions ?? []
      }}
    /> 

  </>);
}