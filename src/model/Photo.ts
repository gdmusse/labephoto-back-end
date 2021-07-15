export class Photo {
  constructor(
    private id: string,
    private subtitle: string,
    private author: string,
    private date: string,
    private file: string,
    private tags: string[],
    private collections: string[]
  ) {}
  
  getId() {
    return this.id;
  }
  getSubtitle() {
    return this.subtitle;
  }

  getAuthor() {
    return this.author;
  }

  getDate() {
    return this.date;
  }

  getFile() {
    return this.file;
  }

  getTags() {
    return this.tags;
  }

  getCollection() {
    return this.collections;
  }

  setId(id: string) {
    this.id = id;
  }
  setSubtitle(subtitle: string) {
    this.subtitle = subtitle;
  }

  setAuthor(author: string) {
    this.author = author;
  }

  setDate(date: string) {
    this.date = date;
  }

  setFile(file: string) {
    this.file = file;
  }

  setTags(tags: string[]) {
    this.tags = tags;
  }

  setCollection(collections: string[]) {
    this.collections = collections;
  }
}

export interface PhotoInputDTO {
   subtitle: string,
   file: string,
   tags: string[]
}

export interface PhotoToCollectionInputDTO {
  photo_id: string,
  collection_id: string
}

export interface PhotoToCollectionOutputDTO {
  photo_id: string,
  collection_id: string,
  date: string
}

export interface PhotoSearchInputDTO {
   subtitle: string,
   author: string,
   tag: string
}

export interface PhotoInCollectionOutputDTO {
   id: string,
   subtitle: string,
   author: string,
   date: string,
   added_date: string,
   file: string,
   tags: string[],

}