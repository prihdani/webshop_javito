interface SearchParams {
    query?: string;
    price?: number;
    inStock?: boolean;
    rating?: number;
    categories?: string[];
    orderBy?: string;
    offset?: number;
    limit?: number;
    [key: string]: string | number | boolean | string[] | undefined;
  }


  export default SearchParams;