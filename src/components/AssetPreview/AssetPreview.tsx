import { getAssetPreviewUrl, getGroupPreviewUrl, getAssetUrl  } from '@api/media/media';
import type { DisplayItemResponseModel } from '@api/model/displayItemResponseModel';
import { DisplayItemType } from "@api/model/displayItemType";

import './AssetPreview.css'
import { Link } from 'react-router-dom';
import { useViewMode } from '../ViewModeState/ViewModeState';

type AssetPreviewProps = {
  item: DisplayItemResponseModel;
};

export function AssetPreview({ item }: AssetPreviewProps) {
  const { isEditMode } = useViewMode();

  let renderElement;
  if (item.type === DisplayItemType.Asset) {
    
    renderElement = ConstructAssetRef(item.id.toString(), isEditMode);
  }
  else if (item.type === DisplayItemType.Group) {
    renderElement = ConstructGroupRef(item.id.toString());
  }


  return renderElement;
}

function ConstructAssetRef(id:string, isEditMode: boolean) {
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
          className="item-asset"
          alt=""
        />
      </a>
    )

  return (
    <figure className="gallery-item">
      {element}
    </figure> 
  )
}

function ConstructGroupRef(id: string) {
  const previewUrl = getGroupPreviewUrl(id);
  return (
    <figure className="gallery-item">
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
    </figure> 
  )
}