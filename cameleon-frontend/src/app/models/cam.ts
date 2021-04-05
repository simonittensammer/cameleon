import {Recording} from "./recording";

export class Cam {
  id: number;
  name: string;
  description: string;
  url: string;
  motionDetection: boolean;
  recordings: Array<Recording>;

  constructor(id: number, name: string, description: string, url: string, motionDetection: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
    this.motionDetection = motionDetection;
  }
}
