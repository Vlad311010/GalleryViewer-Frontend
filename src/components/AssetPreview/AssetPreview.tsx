import { getAssetPreviewUrl, getAssetUrl, getGroupPreviewUrl, useAssetMimeType  } from '@api/media/media';
import type { DisplayItemResponseModel } from '@api/model/displayItemResponseModel';
import { DisplayItemType } from "@api/model/displayItemType";

import './AssetPreview.css'
import { Link } from 'react-router-dom';
import { useViewMode } from '../ViewModeState/ViewModeState';
import type { AssetPosition } from '@/contract/model';

type AssetPreviewProps = {
  item: DisplayItemResponseModel;
  assetPosition?: AssetPosition;
};

export function AssetPreview({ item, assetPosition }: AssetPreviewProps) {
  const { isEditMode } = useViewMode();

  const assetMimeTypeResponse = useAssetMimeType(item.id);
  const assetMimeType = assetMimeTypeResponse.data;
  
  const isVideo = assetMimeType?.startsWith("video") ?? false;
  
  let imageElement;
  if (item.type === DisplayItemType.Asset) {
    imageElement = ConstructAssetRef(item.id, isEditMode, isVideo);
  }
  else if (item.type === DisplayItemType.Group) {
    imageElement = ConstructGroupRef(item.id);
  }


  return (
    <div className="gallery-item">
      <figure className="gallery-item-image">
        {imageElement}
      </figure> 
      {isEditMode && assetPosition && (
        <div className="gallery-item-editor">
          <input
            onChange={(x) => x}
            type="number"
            value={assetPosition.position}
            aria-label="Position"
          />

          <label>
            <input readOnly
              type="checkbox"
              checked={assetPosition.isCover}
              aria-label="Cover"
            />
            Cover
          </label>
        </div>
      )}
    </div>
  );
}

function ConstructAssetRef(id:number, isEditMode: boolean, isVideo: boolean) {
  const previewUrl = getAssetPreviewUrl(id);
  const itemLink = getAssetUrl(id);

  const element = isEditMode 
    ? (
        <Link className="gallery-item-preview"
          to={`/gallery/img/asset/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={previewUrl}
            className="item-asset edit-mode"
            alt=""
          />
          <span className="edit-mode-label">
            Edit
          </span>
        </Link>
      )
    : (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={itemLink}
      >
        <img
          src={previewUrl}
          className={`item-asset ${isVideo && ("video")}`}
          alt=""
        />
      </a>
    )

  return element;
}

function ConstructGroupRef(id: number) {
  const previewUrl = getGroupPreviewUrl(id);
  return (
    <Link
      to={`group/${id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={previewUrl}
        className="item-group"
        alt=""
      />
    </Link>
  )
}