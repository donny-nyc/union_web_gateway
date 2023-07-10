import source from "../../sources/cms_search_source";
import SearchSource from "../../sources/types/search_source_i";

export type SearchResults = {
  id: string,
  name: string,
};

class SearchController {
  source: SearchSource;

  constructor(source: SearchSource) {
    this.source = source;
  }

  async fetch(name: string): Promise<SearchResults[]> {
    const results = this.source.fetch(name);

    return results;
  }
};

const controller = new SearchController(source);

export default controller;
