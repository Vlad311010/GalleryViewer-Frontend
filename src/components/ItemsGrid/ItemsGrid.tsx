import type { DisplayItemResponseModel } from "@api/model";

import { AssetPreview } from '@comp/AssetPreview/AssetPreview';
import { Pagginator } from "../Pagginator/Pagginator";
import { APP_CONFIG } from "@/config";

import './ItemsGrid.css'
import { useEffect } from 'react';
import { isInputElement, isSpecialCombination } from "@/utils/inputEventUtils";

type ItemsGridProps = {
  items: DisplayItemResponseModel[];
  
  page: number;
  totalPages: number;
};

export function ItemsGrid({ items, page, totalPages } : ItemsGridProps) {
  useScrollKeyboardNavigation();

  if (!items) {
    items = [];
  }

  return (<>
    <div className="items-grid">
      {items.map((item:DisplayItemResponseModel) => (
        <AssetPreview
          key={`${item.type}-${item.id}`}
          item={item}
        />
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


function useScrollKeyboardNavigation() {
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

                case "ArrowUp":
                case "KeyW":    
                    event.preventDefault();

                    window.scrollTo({
                        top: document.documentElement.scrollTop - 250,
                        left: document.documentElement.scrollLeft,
                        behavior: "smooth",
                    });
                    break;

                
                case "ArrowDown":
                case "KeyS":
                    event.preventDefault();

                    window.scrollTo({
                        top: document.documentElement.scrollTop + 250,
                        left: document.documentElement.scrollLeft,
                        behavior: "smooth",
                    });
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
}