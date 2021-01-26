import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CamService} from "../../../services/cam.service";
import {Cam} from "../../../models/cam";

@Component({
  selector: 'app-cam-popup',
  templateUrl: './cam-popup.component.html',
  styleUrls: ['./cam-popup.component.scss']
})
export class CamPopupComponent implements OnInit {

  camForm: FormGroup ;

  constructor(
    public camService: CamService
  ) { }

  ngOnInit(): void {
    this.camForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      url: new FormControl('', Validators.required)
    });

    if (this.camService.editedCam) {
      this.camForm.patchValue(this.camService.editedCam);
    }
  }

  onSubmit() {
    if (this.camService.editedCam) {
      var cam = new Cam(this.camService.editedCam.id, this.camForm.value.name, this.camForm.value.description, this.camForm.value.url);
      this.camService.updateCam(cam).subscribe(value => {
        this.camService.getAllCams().subscribe(value2 => {
          this.camService.camList = value2;
        });
      });
    } else {
      this.camService.createCam(this.camForm.value).subscribe(value => {
        this.camService.camList.push(value);
      });
    }
    this.camService.showPopup = false;
  }
}
