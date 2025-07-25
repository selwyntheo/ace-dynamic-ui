export interface MongoQuery {
  collection: string;
  filter?: Record<string, any>;
  projection?: Record<string, any>;
  sort?: Record<string, any>;
  limit?: number;
  skip?: number;
}

export interface MongoQueryResult {
  data: Array<Record<string, any>>;
  count: number;
  query: MongoQuery;
}

export interface MongoCollection {
  name: string;
  documentCount?: number;
}
