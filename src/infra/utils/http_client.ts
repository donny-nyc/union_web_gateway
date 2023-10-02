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
  get(host: string, port: number, path: string): Promise<T>;
  post(host: string, port: number, path: string, body?: any): Promise<T>;
  put(host: string, port: number, path: string, body?: any): Promise<T>;
  delete(host: string, port: number, path: string): Promise<T>;
};

type HttpClientOptions = {
  host: string,
  port: number,
  path: string,
  method: HttpVerb,
  headers: {
    "Content-Type": string,
    "Content-Size"?: number,
  }
};

export class HttpClient<T> {
  get(host: string, port: number, path: string): Promise<T> {
    return new Promise<T>((resolve) => {
      const options = this.prepareOptions(
        host,
        port,
        path,
        HttpVerb.GET
      );

      const req = http.request(options, (res) => {
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

  post(
    host: string, 
    port: number, 
    path: string, 
    body: any
  ): Promise<T> {
    return new Promise<T>((resolve) => {
      const postData: string = JSON.stringify(body);

      const contentLength: number = Buffer.byteLength(postData);

      const options = this.prepareOptions(
        host,
        port,
        path,
        HttpVerb.POST,
        contentLength
      );

      const req 
        = http.request(options, (res) => {
        let data: any = []

        if(res.statusCode !== 200) {
          throw new Error("failed to post");
        }

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log(Buffer.concat(data).toString());

          const result: T = JSON.parse(Buffer.concat(data).toString())

          console.log('POST results:', result);

          resolve(result);
        });
      });

      try {
        if (contentLength > 0) {
          req.write(postData);
        }

        req.end();
      } catch (e: any) {
        console.error(e);
      }
    });
  }

  put(
    host: string, 
    port: number, 
    path: string, 
    body: any
  ): Promise<T> {
    return new Promise<T>((resolve) => {
      const putData: string = JSON.stringify(body);

      const contentLength: number = Buffer.byteLength(putData);

      const options = this.prepareOptions(
        host,
        port,
        path,
        HttpVerb.PUT,
        contentLength
      );

      const req 
        = http.request(options, (res) => {
        let data: any = []

        if(res.statusCode !== 200) {
          throw new Error("failed to put");
        }

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log(Buffer.concat(data).toString());

          const result: T = JSON.parse(Buffer.concat(data).toString())

          console.log('PUT results:', result);

          resolve(result);
        });
      });

      try {
        if (contentLength > 0) {
          req.write(putData);
        }

        req.end();
      } catch (e: any) {
        console.error(e);
      }
    });
  }

  delete(host: string, port: number, path: string): Promise<T> {
    return new Promise<T>((resolve) => {
      const options = this.prepareOptions(
        host,
        port,
        path,
        HttpVerb.DELETE,
      );

      const req 
        = http.request(options, (res) => {
        let data: any = []

        if(res.statusCode !== 200) {
          throw new Error("failed to DELETE");
        }

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          console.log(Buffer.concat(data).toString());

          const result: T = JSON.parse(Buffer.concat(data).toString())

          console.log('DELETE results:', result);

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

  private prepareOptions(
    host: string,
    port: number,
    path: any,
    method: HttpVerb, 
    contentLength?: number
  ): HttpClientOptions {
    const headers = contentLength ?
      {
        'Content-Type': 'application-json',
        'Content-Length': contentLength,
      }
    
    :
      {
        'Content-Type': 'application-json',
      }
    ;

    return  {
      host,
      port,
      path,
      method,
      headers
    };
  }
};
