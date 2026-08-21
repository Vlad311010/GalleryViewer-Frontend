import { useState } from 'react';
import { getAssetUrl } from '@/contract/media/media';

import './AssetView.css';
import { isInputElement, isSpecialCombination } from '@/utils/inputEventUtils';
import { INPUTS } from '@/Constants';

type AssetViewProps = {
  identifier: number;
};

export function AssetView({ identifier }: AssetViewProps) {
  const [zoomed, setZoomed] = useState(false);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

const getViewportSize = () => ({
  width: window.visualViewport?.width ?? window.innerWidth,
  height: window.visualViewport?.height ?? window.innerHeight,
});

const getFitSize = (img: HTMLImageElement) => {
  const viewport = getViewportSize();

  const scale = Math.min(
    viewport.width / img.naturalWidth,
    viewport.height / img.naturalHeight,
    1,
  );

  return {
      width: Math.round(img.naturalWidth * scale),
      height: Math.round(img.naturalHeight * scale),
    };
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setSize(getFitSize(e.currentTarget));
  };

  const handleZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();

    // Mouse position relative to the image
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    const fitSize = getFitSize(img);

    const newSize = zoomed
      ? fitSize
      : {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };

    setZoomed(value => !value);
    setSize(newSize);

    requestAnimationFrame(() => {
      const newRect = img.getBoundingClientRect();

      const newPointX = newRect.left + newRect.width * relativeX;
      const newPointY = newRect.top + newRect.height * relativeY;

      window.scrollBy({
        left: newPointX - e.clientX,
        top: newPointY - e.clientY,
        behavior: "instant",
      });
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;

    if (isInputElement(target) || isSpecialCombination(event)) {
      return;
    }

    switch (event.code) {
      case INPUTS.NEXT_PAGE_ARROWS:
      case INPUTS.NEXT_PAGE_WASD:
        event.preventDefault();
        
        break;
      case INPUTS.PREV_PAGE_ARROWS:
      case INPUTS.PREV_PAGE_WASD:
        event.preventDefault();
        break;

    }
  };


  return (
    <div className="asset-view">
      <img
        src={getAssetUrl(identifier)}
        onLoad={handleLoad}
        onClick={handleZoom}
        width={size.width || undefined}
        height={size.height || undefined}
        style={{
          display: "block",
          userSelect: "none",
          margin: "auto",
          cursor: zoomed ? "zoom-out" : "zoom-in",
          backgroundColor: "hsl(0, 0%, 90%)",
          transition: "background-color 300ms",
        }}
      />
    </div>
  );
}