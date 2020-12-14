import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CamService} from "../../../services/cam.service";

@Component({
  selector: 'app-cam-popup',
  templateUrl: './cam-popup.component.html',
  styleUrls: ['./cam-popup.component.scss']
})
export class CamPopupComponent implements OnInit {

  camForm: FormGroup ;

  constructor(
    private camService: CamService
  ) { }

  ngOnInit(): void {
    this.camForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      url: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.camService.createCam(this.camForm.value).subscribe(value => {
      this.camService.camList.push(value)
    });
  }
}
