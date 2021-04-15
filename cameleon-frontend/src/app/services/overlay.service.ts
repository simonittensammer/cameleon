import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cam} from '../models/cam';
import {OverlayObject} from '../models/overlay-object';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  overlayList: Array<OverlayObject> = [];
  currentDate = new Date();

  SERVER_URL = 'http://localhost:8080/';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1);
  }

  getAllOverlays(): Observable<Array<OverlayObject>> {
    return this.http.get<Array<OverlayObject>>(this.SERVER_URL + 'overlay');
  }

  createOverlayText(overlayObjectText): Observable<OverlayObject> {
    return this.http.post<OverlayObject>(this.SERVER_URL + 'overlay/txt', overlayObjectText);
  }

  createOverlayImg(overlayObjectText): Observable<OverlayObject> {
    return this.http.post<OverlayObject>(this.SERVER_URL + 'overlay/img', overlayObjectText);
  }

  deleteOverlayObject(id: number): void {
    this.http.delete(this.SERVER_URL + 'overlay/' + id).subscribe();
  }

  public sanitizeBase64(picUrl: string): SafeUrl {
    return picUrl.includes('http') ? picUrl : this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + picUrl);
  }
}
