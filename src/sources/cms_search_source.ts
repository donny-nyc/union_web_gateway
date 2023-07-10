import SearchResult from './types/search_result';
import http from 'http';

type CmsSearchResult = {
  _id: string,
  name: string,
};

class CmsSearchSource {
  fetch = async (_: string): Promise<SearchResult[]> => {
    const requestPromise = new Promise<SearchResult[]>((resolve) => {
      http.get('http://localhost:9999/search', (res) => {
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
                id: result._id,
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
