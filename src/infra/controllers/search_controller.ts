import source, { SearchSource } from "../../sources/dummy_search_source";

export type SearchResults = {
  id: string,
  name: string,
};

class SearchController {
  source: SearchSource;

  constructor(source: SearchSource) {
    this.source = source;
  }

  fetch(name: string): SearchResults[] {
    const results = this.source.fetch(name);

    return results;
  }
};

const controller = new SearchController(source);

export default controller;
