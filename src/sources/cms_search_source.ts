import SearchResult from './types/search_result';
import http from 'http';

type CmsSearchResult = {
  id: string,
  name: string,
  price: number,
  unit?: string,
};

class CmsSearchSource {
  fetch = async (search: string): Promise<SearchResult[]> => {
    const requestPromise = new Promise<SearchResult[]>((resolve) => {
      console.log('[CMS Source] Searching for: ', search);

      // The Gateway needs to do a lot more to scrub this input
      search = search.replace(/[^a-zA-Z]/g, '');
      search = search.trim();
      search = search.substring(0, 25); // arbitrary, should be configurable
      console.log('[CMS Source] Scrubbed search: ', search);
      http.get(`http://localhost:9999/search?q=${search}`, (res) => {
        let data: any = []
        console.log('[search] status: ', res.statusCode);

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log('Response finished.');

          const searchResults: SearchResult[] = JSON.parse(Buffer.concat(data).toString())
            .results
            .map((result: CmsSearchResult) => {
              return {
                name: result.name,
                id: result.id,
                price: result.price,
                unit: result.unit,
              };
            });

          console.log('[results] ', searchResults);

          resolve(searchResults);
        });
      }).end();
    });

    const searchResults: SearchResult[] = await requestPromise;

    console.log(searchResults);
    return searchResults;
  }
};

const source = new CmsSearchSource();

export default source;
