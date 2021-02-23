import { Component, OnInit } from '@angular/core';
import {CamService} from '../../services/cam.service';

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
  overlayText: string;

  constructor(
    public camService: CamService
  ) { }

  ngOnInit(): void {
    this.camService.getAllCams().subscribe(value => {
      this.camService.camList = value;
    });
  }

  saveOverlay(): void {
    console.log('camId: ' + this.camId);
    console.log('type: ' + this.overlayType);
    console.log('x: ' + this.posX + ', y: ' + this.posY);
    console.log('scale: ' + this.scale);
    console.log('opacity: ' + this.opacity);
    console.log('color: ' + this.color);
  }
}
