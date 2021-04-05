import { Component, OnInit } from '@angular/core';
import {CamService} from '../services/cam.service';
import {OverlayService} from '../services/overlay.service';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {

  showMultiple = false;

  constructor(
    public camService: CamService,
    public overlayService: OverlayService
  ) { }

  ngOnInit(): void {
    this.overlayService.getAllOverlays().subscribe(value => {
      this.overlayService.overlayList = value;
      console.log(this.overlayService.overlayList);
    });
  }

  scrollDown(): void {
    window.scroll(0, window.innerHeight);
  }
}
