import {Time} from "@angular/common";

export class Recording {
  dayTime: Date;
  image: string;

  constructor(dayTime: Date, image: string) {
    this.dayTime = dayTime;
    this.image = image;
  }
}
