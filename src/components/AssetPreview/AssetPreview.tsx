import { getAssetPreviewUrl, getAssetUrl, getGroupPreviewUrl, useAssetMimeType  } from '@api/media/media';
import type { DisplayItemResponseModel } from '@api/model/displayItemResponseModel';
import { DisplayItemType } from "@api/model/displayItemType";

import './AssetPreview.css'
import { Link, useParams } from 'react-router-dom';
import { useViewMode } from '@comp/ViewModeState/ViewModeState';
import { Loader } from '@comp/Loader/Loader';
import { useGroupContext, type AssetPosition } from '@comp/Group/Group';
import { useEffect, useState } from 'react';
import { CONSTANTS } from '@/Constants';

type AssetPreviewProps = {
  item: DisplayItemResponseModel;
};

export function AssetPreview({ item }: AssetPreviewProps) {
  function getAssetPosition(assetId: number, positions: AssetPosition[]) {
    const positionData : AssetPosition | undefined = positions.find(x => x.assetId === assetId)
    if (!positionData) {
      throw new Error("Position is not defined");
    }

    return positionData;
  }

  const { isEditMode } = useViewMode();
  const groupData = useGroupContext();

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

  const assetPositionData = isEditMode && groupData && getAssetPosition(item.id, groupData.positions);
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
      {isEditMode && assetPositionData && (
        <GroupAssetEditor 
          assetId={item.id}
          position={assetPositionData.position} 
          normalizedPosition={assetPositionData.normalizedPosition} 
          isGroupCoverAsset={item.id === groupData.coverAssetId}
          updateAssetPosition={groupData.updateAssetPosition}
          setAssetCover={groupData.setCoverAsset}
        />
      )}
    </div>
  );
}

interface GroupAssetEditorProps {
  assetId: number;
  position: number;
  normalizedPosition: number;
  isGroupCoverAsset: boolean;
  updateAssetPosition: (id: number, position: number) => void;
  setAssetCover: (id: number) => void;
}

function GroupAssetEditor({ assetId, position, normalizedPosition, isGroupCoverAsset, updateAssetPosition, setAssetCover } : GroupAssetEditorProps) {
  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setPositionInput(event.target.value);
  }

  function updatePosition(event : React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);

    if (Number.isNaN(value) || value < 0) {
      setPositionInput(String(position));
      return;
    }

    updateAssetPosition(assetId, value);
  }

  const [positionInput, setPositionInput] = useState(
    String(position),
  );

  useEffect(() => {
    setPositionInput(String(position));
  }, [position]);

  return (
    <div className="gallery-item-editor">
      <div className="gallery-item-editor-controls">
        <input
          onBlur={updatePosition}
          onChange={handleInput}
          type="number"
          value={positionInput}
          aria-label="Position"
        />

        <label>
          <input readOnly
            type="checkbox"
            checked={isGroupCoverAsset}
            aria-label="Cover"
            onClick={() => setAssetCover(assetId)}
          />
          Cover
        </label>
      </div>

      <div className="gallery-item-editor-normalized">
        Normalized position: {normalizedPosition}
      </div>
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

  const [previewError, setPreviewError] = useState(false);

  return (<>
    <img
    
      src={previewError ? CONSTANTS.ASSET_NOT_FOUND_IMAGE : previewUrl}
      onError={() => setPreviewError(true)}
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