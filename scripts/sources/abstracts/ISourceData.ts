export enum TagType {
  Source = "source",
  Character = "character",
  General = "general",
}

export interface ITag {
  type: TagType;
  list: string[];
}

export interface ISourceData {
  imageUrls: string[];
  tags: ITag[];
  origin: string;
  copyright: string;
  cookie: string;
}
