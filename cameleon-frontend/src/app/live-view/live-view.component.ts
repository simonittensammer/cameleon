import { Component, OnInit } from '@angular/core';
import {CamService} from '../services/cam.service';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {

  constructor(
    public camService: CamService
  ) { }

  ngOnInit(): void {
  }

  scrollDown(): void {
    window.scroll(0, window.innerHeight);
  }
}
