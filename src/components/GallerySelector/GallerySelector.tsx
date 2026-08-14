import type { GalleryResponseModel } from '@api/model';
import { useGalleries } from '@api/gallery/gallery'
import { useAsset, getAssetUrl } from '@api/media/media'
import { Link } from 'react-router-dom';

import './GallerySelector.css'


export function GallerySelector() {
  const { data, isLoading, error } = useGalleries();

  if (!data) {
    return <h3>Loading data</h3>;
  }

  return (
    <div className="nav-page-container">
        <div className="galleries-grid">
           {data.data.map((gallery: GalleryResponseModel) => (
              <GalleryThumbnail
                key={gallery.id}
                galleryData={gallery}
              />
           ))}
        </div>
    </div>
  );
}


type GalleryThumbnailProps = {
  galleryData: GalleryResponseModel
}

export function GalleryThumbnail({ galleryData } : GalleryThumbnailProps) {
  const { data, isLoading, error } = useAsset(galleryData.coverAssetId!, {
    query: {
      enabled: galleryData.coverAssetId != null,
    },
  });

  const assetUrl = getAssetUrl(galleryData.coverAssetId!);

  if (galleryData.coverAssetId == null) {
    return null;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>Failed to load cover</div>;
  }

  if (!assetUrl) {
    return <div>Failed(NONE) to load cover</div>; // load placeholder
  }

  return (
      <Link
        to={`gallery/${galleryData.name}?page=1`}
        className="gallery-thumbnail"
        style={{
          background: `url(${assetUrl}) no-repeat center center`,
          backgroundSize: "cover",
        }}
      >
        {galleryData.name}
      </Link>
  )
}