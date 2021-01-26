import { Injectable } from '@angular/core';
import {Cam} from '../models/cam';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CamService {
  public selectedCam: Cam = new Cam(0, null, null, './assets/welcome.jpg');
  public editedCam: Cam = null;
  showPopup: boolean = false;
  camList: Array<Cam> = [];

  SERVER_URL = 'http://localhost:8080/';

  constructor(
    private http: HttpClient
  ) { }

  getAllCams(): Observable<Array<Cam>> {
    return this.http.get<Array<Cam>>(this.SERVER_URL + 'cam');
  }

  createCam(cam): Observable<Cam> {
    return this.http.post<Cam>(this.SERVER_URL + 'cam', cam);
  }

  updateCam(cam): Observable<Cam> {
    return this.http.put<Cam>(this.SERVER_URL + 'cam', cam);
  }

  deleteCam(id: number): Observable<Cam> {
    return this.http.delete<Cam>(this.SERVER_URL + 'cam/' + id);
  }
}
