import { createContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const SearchContext = createContext<SearchContextValue>({ searchQuery: "", setSearchQuery:(_) => {} });

export function SearchQueryState({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("tags") ?? "";

  const setSearchQuery = (value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);

      if (value) {
        next.set("tags", value);
      } else {
        next.delete("tags");
      }

      next.set("page", "1");

      return next;
    });
  };
  
  
  // const SearchContext = createContext<SearchContextValue | null>(null);
  return (
    <SearchContext value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext>
  );
}


interface SearchContextValue {
  searchQuery: string,
  setSearchQuery: (value: string) => void,
};


