import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  scrollDown() {
    // replacy y-value with current height of window
    window.scroll(0, 750);
  }
}
