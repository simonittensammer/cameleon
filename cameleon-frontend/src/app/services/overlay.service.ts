import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cam} from '../models/cam';
import {OverlayObjectText} from '../models/overlay-object-text';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  SERVER_URL = 'http://localhost:8080/';

  constructor(
    private http: HttpClient
  ) { }

  createOverlayText(overlayObjectText): Observable<OverlayObjectText> {
    return this.http.post<OverlayObjectText>(this.SERVER_URL + 'overlay/txt', overlayObjectText);
  }
}
