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

export type CreateTagAttributes = {
  name: string;
};

export type CreateTagData = {
  type: string;
  attributes: CreateTagAttributes;
};

export type CreateTagRequestPayload = {
  data: CreateTagData;
};

export type CreateTagResponse = {
  data: TagFromApi;
};