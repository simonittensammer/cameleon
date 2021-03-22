import {Component, OnInit} from '@angular/core';
import {CamService} from '../../services/cam.service';
import {OverlayService} from '../../services/overlay.service';
import {OverlayObjectText} from '../../models/overlay-object-text';

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
    if (this.overlayType === 'dateTime') {
      this.overlayText = '$dateTime$';
    }

    if (this.overlayType === 'text' || this.overlayType === 'dateTime') {
      const overlayObjectText = new OverlayObjectText(
        null,
        this.camId,
        this.posX,
        this.posY,
        this.scale,
        this.opacity,
        this.overlayText,
        this.color
      );
      this.overlayService.createOverlayText(overlayObjectText).subscribe(value => {
        console.log(value);
      });
    }
  }
}
