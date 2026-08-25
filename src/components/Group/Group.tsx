import type { ListGroupParams } from  '@api/model/listGroupParams';


import { APP_CONFIG } from "@/config";
import { ItemsGrid } from '@comp/ItemsGrid/ItemsGrid';
import { useContext } from 'react';
import { SearchContext } from '@comp/SearchQueryState/SearchQueryState';
import { useGroupDetails } from '@api/groups/groups';
import { useListGroup } from '@api/asset-browser/asset-browser.ts';
import { Loader } from '../Loader/Loader';
import { groupDetails } from '../../contract/groups/groups';


type GroupProps = {
  identifier: number;
};

export function Group({ identifier } : GroupProps ) {
  const { page } = useContext(SearchContext);
  
  const filterParams: ListGroupParams = { 
    Skip: (page - 1)  * APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows,
    Take: APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows,
  }

  const { data: groupDetails, isPending, isError } = useGroupDetails(identifier);
  const { data : groupAssets } = useListGroup(identifier, filterParams);

  if (isPending) {
    return <div>Loading</div>
  }

  if (!groupDetails) {
    throw new Error("Group details query completed without data");
  }

  return (<>
    <ItemsGrid 
      items = {groupAssets?.items ?? []}
      page = {page}
      totalPages = {groupAssets?.pagesCount ?? 0}
      groupData = {{
        id: groupDetails.id,
        title: groupDetails.title,
        assetsCount: groupDetails.assetsCount,
        coverAssetPosition: groupDetails.coverAssetPosition,
        assetPositions: groupDetails.positions ?? []
      }}
    /> 

  </>);
}