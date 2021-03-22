export class OverlayObject {
  id: number;
  cam: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  text: string;
  color: string;
  url: string;

  constructor(id: number, cam: number, x: number, y: number, scale: number, opacity: number, text: string, color: string, url: string) {
    this.id = id;
    this.cam = cam;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.opacity = opacity;
    this.text = text;
    this.color = color;
    this.url = url;
  }
}
