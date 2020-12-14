import { Injectable } from '@angular/core';
import {Cam} from '../models/cam';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CamService {
  public selectedCam: Cam = new Cam(0, null, null, './assets/welcome.jpg');

  SERVER_URL = 'http://localhost:8080/';

  constructor(
    private http: HttpClient
  ) { }

  getAllCams(): Observable<Array<Cam>> {
    return this.http.get<Array<Cam>>(this.SERVER_URL + 'cam');
  }
}
