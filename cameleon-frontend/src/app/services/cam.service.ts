import { Injectable } from '@angular/core';
import {Cam} from '../models/cam';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CamService {
  public basicCam = new Cam(0, null, null, './assets/welcome.jpg', false);
  public selectedCam: Cam = new Cam(0, null, null, './assets/welcome.jpg', false);
  public editedCam: Cam = null;
  showPopup = false;
  camList: Array<Cam> = [];

  SERVER_URL = 'http://localhost:8080/';

  constructor(
    private http: HttpClient
  ) { }

  scrollToTop(): void {
    window.scroll(0, 0);
  }

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

  getCamlistId(i: number): number {
    if (this.camList[i] != null) {
      return this.camList[i].id;
    }
    return -1;
  }

  getCamlistUrl(i: number): string {
    if (this.camList[i] != null) {
      return this.camList[i].url;
    }
    return this.basicCam.url;
  }

  toggleMotionDetection(cam: Cam): Observable<Cam> {
    return this.http.get<Cam>(this.SERVER_URL + 'md/' + (cam.motionDetection ? 'stop' : 'start') + '/' + cam.id);
  }
}
