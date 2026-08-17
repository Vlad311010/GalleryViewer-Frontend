import { createContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const SearchContext = createContext<SearchContextValue>({ 
    searchQuery: "", setSearchQuery:(_) => {},
    page: 1
});

export function SearchQueryState({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("tags") ?? "";
  let page = Number(searchParams.get("page") ?? 1);
  page = Number.isInteger(page) && page > 0 ? page : 1;
  
  
  const pageQueryParamName = "page";
  const tagsQueryParamName = "tags";
  const setSearchQuery = (value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      
      if (value) {
        next.set(tagsQueryParamName, value);
      } else {
        next.delete(tagsQueryParamName);
      }
      
      next.set(pageQueryParamName, "1");
      
      return next;
    });
  };
  
  return (
    <SearchContext value={{ searchQuery, setSearchQuery, page }}>
      {children}
    </SearchContext>
  );
}


interface SearchContextValue {
  searchQuery: string,
  setSearchQuery: (value: string) => void,

  page: number,
};


