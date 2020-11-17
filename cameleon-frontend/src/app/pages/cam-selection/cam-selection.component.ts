import { Component, OnInit } from '@angular/core';
import {Cam} from '../../models/cam';
import {CamService} from '../../services/cam.service';

@Component({
  selector: 'app-cam-selection',
  templateUrl: './cam-selection.component.html',
  styleUrls: ['./cam-selection.component.scss']
})
export class CamSelectionComponent implements OnInit {

  camList: Array<Cam> = [];

  constructor(
    private camService: CamService
  ) { }

  ngOnInit(): void {
    this.camList.push(new Cam(1, 'Welcome', 'Welcome to Cameleon', './assets/welcome.jpg'));
    this.camList.push(new Cam(2, 'cam1', 'camera1', 'https://10.0.0.1:8080/video'));
  }

  // tslint:disable-next-line:typedef
  changeCam(cam: Cam) {
    console.log(cam);

    this.camService.selectedCam = cam;
  }
}
