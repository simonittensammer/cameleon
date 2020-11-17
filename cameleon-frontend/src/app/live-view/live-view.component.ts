import { Component, OnInit } from '@angular/core';
import {CamService} from '../services/cam.service';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {

  constructor(
    private camService: CamService
  ) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  scrollDown() {
    // replacy y-value with current height of window
    window.scroll(0, 750);
  }
}
