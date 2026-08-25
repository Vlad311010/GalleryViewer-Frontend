import type { GalleryResponseModel } from '@api/model';
import { useGalleries } from '@api/gallery/gallery'
import { getAssetUrl } from '@api/media/media'
import { Link } from 'react-router-dom';

import './GallerySelector.css'

export function GallerySelector() {
  const response = useGalleries();
  
  const data = response.data;

  return (
    <div className="nav-page-container">
        <div className="galleries-grid">
          {data && 
            (data.map((gallery: GalleryResponseModel) => (
                <GalleryThumbnail
                  key={gallery.id}
                  galleryName={gallery.name ?? ""}
                  coverAssetId={gallery.coverAssetId}
                />)
           ))}
        </div>
    </div>
  );
}


type GalleryThumbnailProps = {
  galleryName: string;
  coverAssetId: number | null | undefined;
}

export function GalleryThumbnail({ galleryName, coverAssetId } : GalleryThumbnailProps) {
  let assetUrl;
  if (coverAssetId) {
    assetUrl = getAssetUrl(coverAssetId);
  }
  else {
    assetUrl = "/placeholder";
  }

  return (
      <Link
        to={`gallery/${galleryName}?page=1`}
        className="gallery-thumbnail"
        style={{
          background: `url(${assetUrl}) no-repeat center center`,
          backgroundSize: "cover",
        }}
      >
        {galleryName}
      </Link>
  )
}