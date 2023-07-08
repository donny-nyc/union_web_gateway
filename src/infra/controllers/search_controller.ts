import source, { SearchSource } from "../../sources/dummy_search_source";

class SearchController {
  source: SearchSource;

  constructor(source: SearchSource) {
    this.source = source;
  }

  fetch(name: string): string[] {
    return [name];
  }
};

const controller = new SearchController(source);

export default controller;
