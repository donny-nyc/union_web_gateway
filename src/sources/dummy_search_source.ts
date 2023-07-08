export interface SearchSource {
  fetch: () => string[];
};

class DummySearchSource {
  fetch = (): string[] => {
    return [];
  }
};

const source = new DummySearchSource();

export default source;
