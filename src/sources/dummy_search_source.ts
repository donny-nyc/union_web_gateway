export type SearchResult = {
  id: string,
  name: string,
};

export interface SearchSource {
  fetch: (name: string) => SearchResult[];
};

class DummySearchSource {
  fetch = (_: string): SearchResult[] => {
    const results: SearchResult[] = [];

    const count = Math.floor(Math.random() * (100)) + 1;
    for (let i = 0; i < count; i++) {
      results.push({
        id: `${Math.random() * 10000}`,
        name: `${Math.random() * 10000}`,
      });
    }

    return results;
  }
};

const source = new DummySearchSource();

export default source;
