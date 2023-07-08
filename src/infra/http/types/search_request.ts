import { Request } from 'express';

export interface SearchRequestQuery {
  name: string,
};

type SearchRequest = Request & { query: SearchRequestQuery };

export const Validator = (req: SearchRequest): { [key: string]: string[] } | undefined => {
  let errors: {[key: string]: string[]} = {};

  console.log('[validate] search: ', req.query);

  if (!req.query.name || req.query.name.length === 0) {
    if(!errors['name']) {
      errors['name'] = [];
    }

    errors['name'].push("name cannot be empty");
  }

  if (req.query.name && typeof req.query.name != "string") {
    if(!errors['name']) {
      errors['name'] = [];
    }

    console.log('typeof name: ', typeof(req.query.name));

    if(typeof req.query.name === "object") {
      errors['name'].push("name cannot be declared more than once");
    } else {
      errors['name'].push("name must be a string");
    }
  }

  if(Object.keys(errors).length)
    return errors;
}

export default SearchRequest;
