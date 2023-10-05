import HttpClient from '../infra/utils/http_client';
import {Product} from './types/order';
import SearchResult from './types/search_result';
import http from 'http';

type CmsSearchResult = {
  id: string,
  name: string,
  price: number,
  unit?: string,
};

type GetProductResponse = {
  id: string,
  name: string,
  price: number,
  keywords: string[],
  unit?: string,
  description?: string,
};

class CmsSearchSource {
  private static productsHost = "localhost";
  private static productsPort = 1111;

  static async fetchProduct(
    productId: string
  ): Promise<Product | void> {
    console.log("[fetchProduct] id", productId);

    const productsUrl = `/crud/${productId}`;

    const response
      = await HttpClient.get(
        this.productsHost, 
        this.productsPort,
        productsUrl);

    const product
      = JSON.parse(response as string) as GetProductResponse;

    if (!product) {
      console.error("[fetchProduct] Error: no product found");
      return;
    }

    console.log("[fetchProduct] product", product);

    return product;
  }

  static async fetch(search: string): Promise<SearchResult[]> {
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

export default CmsSearchSource;
