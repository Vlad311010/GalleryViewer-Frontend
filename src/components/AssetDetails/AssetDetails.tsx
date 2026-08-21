import { useState } from 'react';
import { TagSelect } from '@comp/TagSelect/TagSelect';

import './AssetDetails.css';
import { TagCategory } from '@/enums/TagCategory';
import { toCssClass } from '@/utils/tagCategoryHelpers';
import {  getAssetTagsQueryKey, useAddAssetTags, useAssetTags, useRemoveAssetTag } from '@/contract/assets/assets';
import type { AssetTagsResponseModel } from '@/contract/model';
import { CONSTANTS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { getAssetPreviewUrl, getAssetUrl, useAssetMimeType } from '@/contract/media/media';
import { useViewMode } from '@comp/ViewModeState/ViewModeState';


interface AssetDetailsProps {
  identifier: number
}

export function AssetDetails({ identifier } : AssetDetailsProps ) {
  const categoriesOrder = [TagCategory.author, TagCategory.source, TagCategory.character, TagCategory.general];
  
  const queryClient = useQueryClient();
  const { isEditMode } = useViewMode();
  
  const [newTags, setNewTags] = useState<string>("");  
  const { mutate: addAssetTags } = useAddAssetTags({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getAssetTagsQueryKey(identifier),
        });
      },
    },
  });

  const { mutate: removeAssetTag } = useRemoveAssetTag({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getAssetTagsQueryKey(identifier),
        });
      },
    },
  });


  const {data: response} = useAssetTags(identifier);
  const assetTags = response?.data as AssetTagsResponseModel;

  const assetUrl = getAssetUrl(identifier);  
  const assetPreviewUrl = getAssetPreviewUrl(identifier);  
  const { data: assetMimeTypeResponse, isError } = useAssetMimeType(identifier);
  if (isError || !assetMimeTypeResponse) {
    return <></>
  }  
  
  const isVideo = assetMimeTypeResponse.data.startsWith("video");
  return (
    <div className="tag-layout">
      <aside className="tag-sidebar">
      
        {categoriesOrder.map((category) => (
          <section key={category} className="tag-category">
            <h3 className="tag-category-title">{category}</h3>

            <div className="tag-category-list">
              {assetTags && 
                (assetTags.tags[category]?.map(tag => (
                  <span key={tag.name} className="tag-entry">
                    <a className={`tag-link tag-type ${toCssClass(category)}`}>
                      <span>
                        <span className="tag-name">{tag.name}</span>
                        <span className="tag-occurrences">{tag.occurrences}</span>
                      </span>
                    </a>
                    {isEditMode && (<span className="tag-entry-action" onClick={() => removeTag(tag.name!)}>
                      —
                    </span>)}
                  </span>
                )
              ))}
              
            </div>
          </section>
        ))}
        
      </aside>

    <main className="asset-view">
      <section className="tag-input-bar">
        {isEditMode && (<TagSelect
          value={newTags}
          setValue={setNewTags}
          onSubmit={submitNewTags}
        />)}
      </section>

      <section>
        <a href={assetUrl} target="_blank">
          <img 
            src={isVideo ? assetPreviewUrl : assetUrl}
            className="asset-content"
            alt=""
          />
        </a>
      </section>
    </main>
  </div>
  );

  function submitNewTags(tagsInput: string) {
    if (window.confirm("Submit?")) {
      addAssetTags( {assetId: identifier, data: parseTagsInput(tagsInput) });
    }
  }

  function removeTag(tagName: string) {
    if (window.confirm("Remove?")) {
      removeAssetTag( {assetId: identifier, tag: tagName });
    }
  }

  function parseTagsInput(value: string) {
    const tags = value
      .split(CONSTANTS.SPACE_CHARACTER)
      .map(x => x.trim())
      .filter(Boolean);

    return tags;
  }
}