import { Component, OnInit } from '@angular/core';
import {Cam} from '../../models/cam';
import {CamService} from '../../services/cam.service';

@Component({
  selector: 'app-cam-selection',
  templateUrl: './cam-selection.component.html',
  styleUrls: ['./cam-selection.component.scss']
})
export class CamSelectionComponent implements OnInit {

  constructor(
    public camService: CamService
  ) { }

  ngOnInit(): void {
    // this.camList.push(new Cam(1, 'Welcome', 'Welcome to Cameleon', './assets/welcome.jpg'));
    // this.camList.push(new Cam(2, 'cam1', 'camera1', 'https://10.0.0.1:8080/video'));
    this.camService.getAllCams().subscribe(value => {
      this.camService.camList = value;
    });
  }

  // tslint:disable-next-line:typedef
  changeCam(cam: Cam) {
    console.log(cam);

    this.camService.selectedCam = cam;
  }

  addCam(): void {
    this.camService.showPopup = true;
    this.camService.editedCam = null;
  }

  editCam(cam: Cam): void {
    this.camService.showPopup = true;
    this.camService.editedCam = cam;
  }

  deleteCam(id: number): void {
    this.camService.deleteCam(id).subscribe(value => {
      this.camService.getAllCams().subscribe(value2 => {
        this.camService.camList = value2;
      });
    });
  }

  toggleMotionDetection(cam: Cam): void {
    this.camService.toggleMotionDetection(cam).subscribe(value => {
      console.log(value);
      this.camService.camList.forEach(c => {
        if (c.id === value.id) {
          c.motionDetection = value.motionDetection;
          return;
        }
      });
    });
  }
}
