export type SearchResult = {
  id: string,
  name: string,
};

export interface SearchSource {
  fetch: (name: string) => Promise<SearchResult[]>;
};

class DummySearchSource {
  fetch = async (_: string): Promise<SearchResult[]> => {
    const requestPromise = new Promise<SearchResult[]>((resolve) => {
      const dummyResults: SearchResult[] = [
        {
          name: 'Mango',
          id: 'mng10',
        },
        {
          name: 'Porridge',
          id: 'prrd9',
        },
      ];

      resolve(dummyResults);
    });

    const searchResults: SearchResult[] = await requestPromise;

    console.log(searchResults);
    return searchResults;
  }
};

const source = new DummySearchSource();

export default source;
