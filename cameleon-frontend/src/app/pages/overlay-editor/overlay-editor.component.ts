import {Component, OnInit} from '@angular/core';
import {CamService} from '../../services/cam.service';
import {OverlayService} from '../../services/overlay.service';
import {OverlayObject} from '../../models/overlay-object';

@Component({
  selector: 'app-overlay-editor',
  templateUrl: './overlay-editor.component.html',
  styleUrls: ['./overlay-editor.component.scss']
})
export class OverlayEditorComponent implements OnInit {
  camId: number;
  overlayType = 'text';
  posY = 0;
  posX = 0;
  scale = 1;
  opacity = 1;
  color = '#eeeeee';
  overlayText = '';

  constructor(
    public camService: CamService,
    public overlayService: OverlayService
  ) {
  }

  ngOnInit(): void {
    this.camService.getAllCams().subscribe(value => {
      this.camService.camList = value;
    });
  }

  saveOverlay(): void {
    let overlayObject = null;
    if (this.overlayType === 'dateTime') {
      this.overlayText = '$dateTime$';
    }

    if (this.overlayType === 'text' || this.overlayType === 'dateTime') {
      overlayObject = new OverlayObject(
        null,
        this.camId,
        this.posX,
        this.posY,
        this.scale,
        this.opacity,
        this.overlayText,
        this.color,
        null
      );

      this.overlayService.createOverlayText(overlayObject).subscribe(value => {
        this.overlayService.overlayList.push(value);
        console.log(this.overlayService.overlayList);
      });
    }

    if (this.overlayType === 'image') {
      overlayObject = new OverlayObject(
        null,
        this.camId,
        this.posX,
        this.posY,
        this.scale,
        this.opacity,
        null,
        null,
        'image url'
      );

      this.overlayService.createOverlayImg(overlayObject).subscribe(value => {
        this.overlayService.overlayList.push(value);
        console.log(this.overlayService.overlayList);
      });
    }
  }
}
