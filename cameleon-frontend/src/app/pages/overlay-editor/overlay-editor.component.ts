import {Component, OnInit} from '@angular/core';
import {CamService} from '../../services/cam.service';
import {OverlayService} from '../../services/overlay.service';
import {OverlayObject} from '../../models/overlay-object';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  opacity = 1.0;
  color = '#eeeeee';
  overlayText = 'some text';
  base64textString = '';

  constructor(
    public camService: CamService,
    public overlayService: OverlayService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.camService.getAllCams().subscribe(value => {
      this.camService.camList = value;
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
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
        this.openSnackBar('Overlayobject added successfully!', 'OK');
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
        this.base64textString
      );

      this.overlayService.createOverlayImg(overlayObject).subscribe(value => {
        this.overlayService.overlayList.push(value);
        console.log(this.overlayService.overlayList);
        this.openSnackBar('Overlayobject added successfully!', 'OK');
      });
    }
  }

  // _handleReaderLoaded(readerEvt): void {
  //   console.log(readerEvt.target.files[0]);
  //   const binaryString = readerEvt.target.result;
  //   this.base64textString = btoa(binaryString);
  // }

  _handleReaderLoaded(readerEvt): void {
    const file = readerEvt.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64textString = reader.result.toString();
    };
  }
}
