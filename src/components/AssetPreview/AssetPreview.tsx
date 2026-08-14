import { getAssetPreviewUrl, getGroupPreviewUrl, getAssetUrl  } from '@api/media/media';
import type { DisplayItemResponseModel } from '@api/model/displayItemResponseModel';
import { DisplayItemType } from "@api/model/displayItemType";

import './AssetPreview.css'
import { Link } from 'react-router-dom';

type AssetPreviewProps = {
  item: DisplayItemResponseModel;
};

export function AssetPreview({ item }: AssetPreviewProps) {

  let renderElement;
  if (item.type === DisplayItemType.Asset) {
    const previewUrl = getAssetPreviewUrl(item.id);
    renderElement = ConstructAssetRef(getAssetUrl(item.id), previewUrl);
  }
  else if (item.type === DisplayItemType.Group) {
    const previewUrl = getGroupPreviewUrl(item.id);
    renderElement = ConstructGroupRef(item.id.toString(), previewUrl);
  }


  return renderElement;
}

function ConstructAssetRef(itemLink:string, previewUrl: string) {
  return (
    <figure className="gallery-item">
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
    </figure> 
  )
}

function ConstructGroupRef(id: string, previewUrl: string) {
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