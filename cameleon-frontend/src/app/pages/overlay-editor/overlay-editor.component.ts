import { Component, OnInit } from '@angular/core';
import {CamService} from '../../services/cam.service';

@Component({
  selector: 'app-overlay-editor',
  templateUrl: './overlay-editor.component.html',
  styleUrls: ['./overlay-editor.component.scss']
})
export class OverlayEditorComponent implements OnInit {
  color = '#eeeeee';

  constructor(
    public camService: CamService
  ) { }

  ngOnInit(): void {
    this.camService.getAllCams().subscribe(value => {
      this.camService.camList = value;
    });
  }

}
