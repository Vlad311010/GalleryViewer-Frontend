import { getAssetPreviewUrl, getAssetUrl, getGroupPreviewUrl, useAssetMimeType  } from '@api/media/media';
import type { DisplayItemResponseModel } from '@api/model/displayItemResponseModel';
import { DisplayItemType } from "@api/model/displayItemType";

import './AssetPreview.css'
import { Link, useParams } from 'react-router-dom';
import { useViewMode } from '../ViewModeState/ViewModeState';
import type { AssetPosition } from '@/contract/model';
import { Loader } from '../Loader/Loader';

type AssetPreviewProps = {
  item: DisplayItemResponseModel;
  assetPosition?: AssetPosition;
};

export function AssetPreview({ item, assetPosition }: AssetPreviewProps) {
  const { isEditMode } = useViewMode();
  const { data: assetMimeType, isLoading } = useAssetMimeType(item.id);

  if (isLoading) {
    return (
      <div className="gallery-item">
        <figure className="gallery-item-image">
          <Loader width={100} height={100} />
        </figure>
      </div>
    );
  }


  const isVideo = assetMimeType?.startsWith("video") ?? false;
  const isGroup = item.type === DisplayItemType.Group;

  return (
    <div className="gallery-item">
      <figure className="gallery-item-image">
        <AssetLink 
          id={item.id}
          isEditMode={isEditMode}
          isGroup={isGroup}
        >
          <PreviewMedia 
            id={item.id}
            isEditMode={isEditMode}
            isGroup={isGroup}
            isVideo={isVideo}
          />
        </AssetLink>
      </figure>
      {isEditMode && assetPosition && (
        <GroupAssetEditor assetPosition={assetPosition} />
      )}
    </div>
  );
}

interface GroupAssetEditorProps {
  assetPosition: AssetPosition;
}

function GroupAssetEditor({ assetPosition } : GroupAssetEditorProps) {
  return (
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
  );
}

interface AssetLinkProps  {
  id: number;
  isGroup : boolean;
  isEditMode : boolean;
  children: React.ReactNode;
}

function AssetLink({ id, isGroup, isEditMode, children } : AssetLinkProps) {
  if (isGroup) {
    return (
      <Link
        to={`group/${id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </Link> 
    )
  }

  const { identifier: galleryName } = useParams<{ identifier: string }>();
  return (
    <Link 
      className="gallery-item-preview"
      to={isEditMode ? `/gallery/${galleryName}/asset/${id}` : `/gallery/${galleryName}/asset/${id}/view`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  )
}

interface PreviewMediaProps  {
  id: number;
  isGroup : boolean;
  isVideo : boolean;
  isEditMode : boolean;
}

function PreviewMedia({ id, isGroup, isEditMode, isVideo } : PreviewMediaProps) {
  const previewUrl = isGroup ? getGroupPreviewUrl(id) : getAssetPreviewUrl(id);
  const classStyle = isGroup 
    ? "item-group" 
    : `item-asset ${isVideo && ("video")}`;

  return (<>
    <img
      src={previewUrl}
      className={classStyle}
      alt=""
    />

    {isEditMode && !isGroup && 
      (<span className="edit-mode-label">
        Edit
      </span>)
    }
  </>);
}