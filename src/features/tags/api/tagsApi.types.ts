export type SearchTagsParams = {
  search?: string;
};

export type TagFromApi = {
  id: string;
  type: string;
  attributes: {
    name: string;
  };
};

export type SearchTagsResponse = {
  data: TagFromApi[];
};

export type Tag = {
  id: string;
  name: string;
};