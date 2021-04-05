import {Recording} from "./recording";

export class Cam {
  id: number;
  name: string;
  description: string;
  url: string;
  recordings: Array<Recording>;

  constructor(id: number, name: string, description: string, url: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
  }
}
