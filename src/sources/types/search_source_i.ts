import SearchResult from "./search_result";

export interface SearchSource {
  fetch: (name: string) => Promise<SearchResult[]>;
};

export default SearchSource;
