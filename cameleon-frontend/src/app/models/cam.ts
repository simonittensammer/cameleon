export class Cam {
  id: number;
  name: string;
  desc: string;
  url: string;

  constructor(id: number, name: string, desc: string, url: string) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.url = url;
  }
}
