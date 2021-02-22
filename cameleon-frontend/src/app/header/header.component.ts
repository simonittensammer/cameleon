import { Component, OnInit } from '@angular/core';
import {CamService} from '../services/cam.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private camService: CamService
  ) { }

  ngOnInit(): void {
  }
}
