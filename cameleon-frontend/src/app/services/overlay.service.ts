import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cam} from '../models/cam';
import {OverlayObject} from '../models/overlay-object';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  overlayList: Array<OverlayObject> = [];

  SERVER_URL = 'http://localhost:8080/';

  constructor(
    private http: HttpClient
  ) { }

  getAllOverlays(): Observable<Array<OverlayObject>> {
    return this.http.get<Array<OverlayObject>>(this.SERVER_URL + 'overlay');
  }

  createOverlayText(overlayObjectText): Observable<OverlayObject> {
    return this.http.post<OverlayObject>(this.SERVER_URL + 'overlay/txt', overlayObjectText);
  }

  createOverlayImg(overlayObjectText): Observable<OverlayObject> {
    return this.http.post<OverlayObject>(this.SERVER_URL + 'overlay/img', overlayObjectText);
  }
}
