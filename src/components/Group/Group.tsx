import type { ListGroupParams } from  '@api/model/listGroupParams';


import { APP_CONFIG } from "@/config";
import { ItemsGrid } from '@comp/ItemsGrid/ItemsGrid';
import { createContext, useContext, useEffect, useState } from 'react';
import { SearchContext } from '@comp/SearchQueryState/SearchQueryState';
import { getGroupDetailsQueryKey, groupSetCover, useGroupDetails, useGroupSetPositons } from '@api/groups/groups';
import { getListGroupQueryKey, listGroup, useListGroup } from '@api/asset-browser/asset-browser.ts';

import "./Group.css";
import { useQueryClient } from '@tanstack/react-query';


interface GroupProps {
  identifier: number;
};


export interface AssetPosition {
  assetId: number;
  position: number;
  normalizedPosition: number;
}

export interface GroupContextValue {
  groupId: number;
  galleryId: number;
  isAssetAddRemoveAllowed: boolean;
  title?: string | null;
  
  positions: AssetPosition[];
  updateAssetPosition: (id: number, position: number) => void
  
  coverAssetId: number;
  setCoverAsset: (id: number) => void
}


const GroupContext = createContext<GroupContextValue | null>(null);

export function Group({ identifier } : GroupProps ) {
  function normalizeAssetPositions() {
    setAssetPositions(prev =>
      [...prev]
        .sort((a, b) => a.position - b.position)
        .map((assetPosition, idx) => ({
          ...assetPosition,
          normalizedPosition: idx,
        }))
    );
  }

  function updateAssetPosition(id: number, position: number) {
    setAssetPositions(prev =>
      prev.map(asset =>      
        asset.assetId === id 
        ? { ...asset, position }
        : asset
      )
    );

    normalizeAssetPositions();
  };

  function setCoverAsset(id: number) {
    if (!groupDetails) {
      return;
    }

    setCoverAssetId(id);

    const request = { assetId: id }
    groupSetCover(groupDetails.id, request);
  };

  function onSubmit(groupId: number,) {
    const body = {
      positions: assetPositions.map(x => ({id: x.assetId, position: x.normalizedPosition }))
    }

    const request = {id: groupId, data: body }
    
    if (window.confirm("Submit?")) {
      groupSetPositons(request);
    }
  }
  

  const { page } = useContext(SearchContext);
  const queryClient = useQueryClient();
  
  const filterParams: ListGroupParams = { 
    Skip: (page - 1)  * APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows,
    Take: APP_CONFIG.galleryItemsPerRow * APP_CONFIG.galleryRows,
  }  

  const { data : groupAssets } = useListGroup(identifier, filterParams);

  const { data: groupDetails, isPending } = useGroupDetails(identifier);
  const [assetPositions, setAssetPositions] = useState<AssetPosition[]>([]);
  const [coverAssetId, setCoverAssetId] = useState(0);
  
  const { mutate: groupSetPositons } = useGroupSetPositons({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getListGroupQueryKey(identifier),
          }),
          queryClient.invalidateQueries({
            queryKey: getGroupDetailsQueryKey(identifier),
          }),
        ]);
      }
    },
  });

  useEffect(() => {
    if (groupDetails) {
      setAssetPositions(groupDetails.positions?.map(x => ({assetId: x.id, position: x.position, normalizedPosition: x.position })) ?? []);
      setCoverAssetId(groupDetails.positions[groupDetails.coverAssetPosition].id)
    }
  }, [groupDetails]);

  if (isPending) {
    return <div>Loading</div>
  }

  if (!groupDetails) {
    throw new Error("Group details query completed without data");
  }
  

  return (
    <main className="group-layout">
      <title>{groupDetails.title ?? `group: ${groupDetails.id}`}</title>
      <section className="controlls-bar">
        <button className="button button-subtle button-sm" onClick={async () => onSubmit(groupDetails.id)}>
          SUBMIT POSITION EDITS
        </button>
      </section>

      <section className="group-content">
        <GroupContext value=
          {{
            groupId: groupDetails.id,
            galleryId: groupDetails.galleryId,
            isAssetAddRemoveAllowed: groupDetails.isAssetAddRemoveAllowed,
            title: groupDetails.title,
            
            positions: assetPositions,
            updateAssetPosition: updateAssetPosition,
            
            coverAssetId: coverAssetId,
            setCoverAsset: setCoverAsset
          }}
        >
          <ItemsGrid 
            items = {groupAssets?.items ?? []}
            page = {page}
            totalPages = {groupAssets?.pagesCount ?? 0}
          /> 
        </GroupContext>
      </section>
    </main>
  );
}

export function useGroupContext() {
  const context = useContext(GroupContext);
  return context;
}
