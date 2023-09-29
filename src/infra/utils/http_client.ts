import http, { OutgoingHttpHeader } from 'http';

export enum HttpVerb {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
};

export enum HttpHeader {
  CONTENT_TYPE = "Content-Type",
  CONTENT_SIZE = "Content-Size",
};

export interface HttpClientI<T> {
  get(host: string, port: number, path: string, headers?: HttpHeaders): Promise<T>;
  post(host: string, port: number, path: string, headers?: HttpHeaders): Promise<T>;
  put(host: string, port: number, path: string, headers?: HttpHeaders): Promise<T>;
  delete(host: string, port: number, path: string, headers?: HttpHeaders): Promise<T>;
};

type HttpClientOptions = {
  host: string,
  port: number,
  path: string,
  verb: HttpVerb,
  headers: {
    "Content-Type": string,
    "Content-Size": number,
  }
};

export class HttpClient<T> {
  get(host: string, port: number, path: string): Promise<T> {
    return new Promise<T>((resolve) => {
      const req = http.request(this.prepareOptions(HttpVerb.GET), (res) => {
        let data: any = []

        if(res.statusCode !== 200) {
          throw new Error("failed to get");
        }

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log('Order found');

          console.log(Buffer.concat(data).toString());

          const result: T = JSON.parse(Buffer.concat(data).toString())

          console.log('[Orders] GET result: ', result);

          resolve(result);
        });
      });

      try {
        req.end();
      } catch (e: any) {
        console.error(e);
      }
    });
  }

  post(host: string, port: number, path: string, body: any): Promise<T> {
    return new Promise<T>((resolve) => {
      const req = http.request(this.prepareOptions(HttpVerb.POST), (res) => {
        let data: any = []

        if(res.statusCode !== 200) {
          throw new Error("failed to post");
        }

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log('Order found');

          console.log(Buffer.concat(data).toString());

          const result: T = JSON.parse(Buffer.concat(data).toString())

          console.log('[Orders] GET result: ', result);

          resolve(result);
        });
      });

      try {
        req.write(post_data);
        req.end();
      } catch (e: any) {
        console.error(e);
      }
    });
  }

  private prepareOptions(verb: HttpVerb, headers?: HttpHeaders): HttpClientOptions {

  }
};
