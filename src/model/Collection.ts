export class Collection {
  constructor(
    private id: string,
    private title: string,
    private subtitle: string,
    private author_id: string,
    private date: string,
    private image?: string
  ) {}

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getSubtitle() {
    return this.subtitle;
  }

  getImage() {
    return this.image;
  }

  getDate() {
    return this.date;
  }

  getAuthorId() {
    return this.author_id;
  }

  setId(id: string) {
    this.id = id;
  }

  setTitle(title: string) {
    this.title = title;
  }

  setSubtitle(subtitle: string) {
    this.subtitle = subtitle;
  }

  setImages(image: string) {
    this.image = image;
  }

  setDate(date: string) {
    this.date = date;
  }

  setAuthorId(author_id: string) {
    this.author_id = author_id;
  }
}

export interface PhotoCollectionInputDTO {
  title: string;
  subtitle: string;
  image: string;
}
