import {Component, HostListener, OnInit} from '@angular/core';
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

  selectedOverlayObject: OverlayObject;
  selectedOverlayObjectElement;

  editing: boolean;

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
        this.stopEditing();
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
        this.stopEditing();
      });
    }
  }
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

  selectObject(id: number, event: Event): void {

    if (!this.editing) {
      if (this.selectedOverlayObjectElement !== undefined) {
        this.selectedOverlayObjectElement.classList.remove('selected');
      }

      if (this.selectedOverlayObjectElement === event.target) {
        this.selectedOverlayObjectElement = undefined;
        this.selectedOverlayObject = undefined;
      } else {
        this.selectedOverlayObject = this.overlayService.overlayList.find(overlay => overlay.id === id);
        this.selectedOverlayObjectElement = event.target;
        this.selectedOverlayObjectElement.classList.add('selected');

        if (this.selectedOverlayObject.url !== '') {
          this.overlayType = 'image';
        } else if (this.selectedOverlayObject.text === '$dateTime$') {
          this.overlayType = 'dateTime';
        } else {
          this.overlayType = 'text';
        }
        this.posY = this.selectedOverlayObject.y;
        this.posX = this.selectedOverlayObject.x;
        this.scale = this.selectedOverlayObject.scale;
        this.opacity = this.selectedOverlayObject.opacity;
        this.color = this.selectedOverlayObject.color;
        this.overlayText = this.selectedOverlayObject.text;
        this.base64textString = '';
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
/*
    if (event.keyCode === 8 || event.keyCode === 46) {
      this.overlayService.overlayList.splice(
        this.overlayService.overlayList.indexOf(this.selectedOverlayObject), 1
      );
      this.overlayService.deleteOverlayObject(this.selectedOverlayObject.id);

      this.selectedOverlayObject = undefined;
      this.selectedOverlayObjectElement = undefined;
    }*/
  }

  addOverlay(): void {
    this.editing = true;
  }

  private stopEditing(): void {
    this.editing = false;

    if (this.selectedOverlayObjectElement !== undefined) {
      this.selectedOverlayObjectElement.classList.remove('selected');
    }
    this.selectedOverlayObjectElement = undefined;
    this.selectedOverlayObject = undefined;

    this.overlayType = 'text';
    this.posY = 0;
    this.posX = 0;
    this.scale = 1;
    this.opacity = 1.0;
    this.color = '#eeeeee';
    this.overlayText = 'some text';
    this.base64textString = '';
  }

  private deleteOverlay(): void {
    this.overlayService.overlayList.splice(
      this.overlayService.overlayList.indexOf(this.selectedOverlayObject), 1
    );
    this.overlayService.deleteOverlayObject(this.selectedOverlayObject.id);

    this.selectedOverlayObject = undefined;
    this.selectedOverlayObjectElement = undefined;
  }
}
