import type { DisplayItemResponseModel } from "@api/model";

import { AssetPreview } from '@comp/AssetPreview/AssetPreview';
import { Pagginator } from "../Pagginator/Pagginator";
import { APP_CONFIG } from "@/config";

import './ItemsGrid.css'
import { Suspense, useEffect, useRef } from 'react';
import { isInputElement, isSpecialCombination } from "@/utils/inputEventUtils";
import { INPUTS } from "@/Constants";
import type { AssetPosition } from "@/contract/model/assetPosition";
import { Loader } from "../Loader/Loader";


interface GroupData {
  id: number,
  title?: string | null;
  assetsCount: number 
  assetPositions: AssetPosition[],  
  coverAssetPosition: number;
}

type ItemsGridProps = {
  items: DisplayItemResponseModel[];
  
  page: number;
  totalPages: number;

  groupData?: GroupData;
};

export function ItemsGrid({ items, page, totalPages, groupData } : ItemsGridProps) {
  const mousePos = useRef({ x: 0, y: 0 });
  useScrollKeyboardNavigation(mousePos);


  return (<>
    <div className="items-grid">
      {items && 
        (items.map((item:DisplayItemResponseModel) => (
          <AssetPreview
            key={`${item.type}-${item.id}`}
            item={item}
            assetPosition={groupData ? getAssetPosition(groupData.assetPositions, Number(item.id)) : undefined}
          />)
      ))}
    </div>

    <Pagginator 
      currentPage = {page}
      maxPreviousPageButtons = {APP_CONFIG.paginatorMaxPreviousPageButtons}
      maxButtonsDisplayed = {APP_CONFIG.paginatorMaxButtonsDisplayed}
      totalPages = {totalPages}
      urlConstructor={(pageNumber) => `?page=${pageNumber}`}
    />

  </>);
}


function useScrollKeyboardNavigation(mousePos: React.RefObject<{x: number; y: number;}>) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;

            // Don't hijack keyboard input
            if (isInputElement(target) || isSpecialCombination(event)) {
              return;
            }

            switch (event.code) {
                case "Home":
                case "End":
                  event.preventDefault();
                  break;  

                case INPUTS.SCROLL_UP_ARROWS:
                case INPUTS.SCROLL_UP_WASD:
                    event.preventDefault();

                    window.scrollTo({
                        top: document.documentElement.scrollTop - 250,
                        left: document.documentElement.scrollLeft,
                        behavior: "smooth",
                    });
                    break;

                
                case INPUTS.SCROLL_DOWN_ARROWS:
                case INPUTS.SCROLL_DOWN_WASD:
                    event.preventDefault();

                    window.scrollTo({
                        top: document.documentElement.scrollTop + 250,
                        left: document.documentElement.scrollLeft,
                        behavior: "smooth",
                    });
                    break;

                case INPUTS.FOLLOW_PREVIEW_LINK:
                  openImgUnderMouse(mousePos.current.x, mousePos.current.y);
                  break;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
          mousePos.current.x = e.clientX;
          mousePos.current.y = e.clientY;
        };

        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    
}

function openImgUnderMouse(x: number, y: number) {
  const imgPreview = document
    .elementsFromPoint(x, y)
    .find(element => element.classList.contains("gallery-item"));

  if (imgPreview) {
    const imgSrc = imgPreview.querySelector<HTMLAnchorElement>("a")?.href;

    if (imgSrc) {
      window.open(imgSrc);
    }
  }
}

function getAssetPosition(assetsData: AssetPosition[], assetId: number) {
  const positionData : AssetPosition | undefined = assetsData.find(x => x.id === assetId)
  if (!positionData) {
    throw new Error("Not found");
  }

  return positionData;
}
