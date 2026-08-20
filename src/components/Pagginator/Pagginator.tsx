import { Link, useNavigate } from "react-router-dom";

import './Pagginator.css';
import { useEffect } from "react";
import { isInputElement, isSpecialCombination } from "@/utils/inputEventUtils";
import { INPUTS } from "@/Constants";

type PagginatorProps = {
    currentPage: number;

    maxPreviousPageButtons: number;
    maxButtonsDisplayed: number;

    totalPages: number;

    urlConstructor: (pageNumber:number) => string;

    displayMoveButtons?: boolean;
    displayJumpButtons?: boolean;
}


export function Pagginator({
    currentPage, 
    maxPreviousPageButtons,
    maxButtonsDisplayed,
    totalPages,
    urlConstructor,
    displayMoveButtons = true,
    displayJumpButtons = true
} : PagginatorProps) {

    usePagginatorKeyboardNavigation(
        currentPage,
        totalPages,
        urlConstructor,
        displayMoveButtons
    );
    
    let startElement = Clamp(currentPage - maxPreviousPageButtons, 1, totalPages);
    const endElement = Clamp(startElement + maxButtonsDisplayed - 1, 1, totalPages);
    
    const elementCount = endElement - startElement + 1;
    if (elementCount < maxButtonsDisplayed) {
        startElement = Clamp(startElement - (maxButtonsDisplayed - elementCount), 1, totalPages);
    }

    let pages : number[] = [];
    for (let index = startElement; index <= endElement; index++) {
        pages.push(index);   
    }

    const prevPageButton = <PagginatorElement 
        pageNumber={Clamp(currentPage-1, 1, totalPages)} 
        isCurrent={false}
        urlConstructor={urlConstructor}
        buttonSymbol="‹"
    />
    const nextPageButton = <PagginatorElement 
        pageNumber={Clamp(currentPage+1, 1, totalPages)} 
        isCurrent={false}
        urlConstructor={urlConstructor}
        buttonSymbol="›"
    />
    const firstPageButton = <PagginatorElement 
        pageNumber={1} 
        isCurrent={false}
        urlConstructor={urlConstructor}
        buttonSymbol="«"
    />
    const lastPageButton = <PagginatorElement 
        pageNumber={totalPages} 
        isCurrent={false}
        urlConstructor={urlConstructor}
        buttonSymbol="»"
    />

    return (
        <div className="center paginator">
            {displayJumpButtons && firstPageButton}
            {displayMoveButtons && prevPageButton}

            {pages.map( (page:number) => (
                <PagginatorElement 
                    key={page}
                    pageNumber={page} 
                    isCurrent={currentPage === page}
                    urlConstructor={urlConstructor}
                />
             ))}
            
            {displayMoveButtons && nextPageButton}
            {displayJumpButtons && lastPageButton}
        </div>
    )
}


type PagginatorElementProps = {
    pageNumber : number;
    isCurrent : boolean;
    buttonSymbol?: string;
    urlConstructor: (pageNumber:number) => string;
}

function PagginatorElement({ pageNumber, isCurrent, urlConstructor, buttonSymbol } : PagginatorElementProps) {
    
    const elementStyle = isCurrent ? 'active' : '';
    return (
        <Link 
          to = {urlConstructor(pageNumber)}
          className={elementStyle}
        >
            {buttonSymbol ? buttonSymbol : pageNumber}
        </Link>

    )
}

function Clamp(value:number, min:number, max:number) {
  return Math.min(Math.max(value, min), max);
};

function usePagginatorKeyboardNavigation(
    currentPage: number,
    totalPages: number,
    urlConstructor: (pageNumber: number) => string,
    enabled: boolean
) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;

            if (isInputElement(target) || isSpecialCombination(event)) {
              return;
            }

            let page: number | undefined;
            switch (event.code) {
                case INPUTS.PREV_PAGE_ARROWS:
                case INPUTS.PREV_PAGE_WASD:
                    page = Clamp(currentPage - 1, 1, totalPages);
                    break;

                case INPUTS.NEXT_PAGE_ARROWS:
                case INPUTS.NEXT_PAGE_WASD:
                    page = Clamp(currentPage + 1, 1, totalPages);
                    break;

                default:
                    return;
            }

            if (page !== currentPage) {
                event.preventDefault();
                navigate(urlConstructor(page));
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "instant",
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        currentPage,
        urlConstructor,
        enabled,
        navigate
    ]);
}
