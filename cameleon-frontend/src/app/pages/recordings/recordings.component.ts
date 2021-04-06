import { Component, OnInit } from '@angular/core';
import {CamService} from '../../services/cam.service';
import {Recording} from '../../models/recording';
import {Cam} from "../../models/cam";
import {dashCaseToCamelCase} from "@angular/compiler/src/util";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.scss']
})
export class RecordingsComponent implements OnInit {

  startDate: Date;
  endDate: Date;

  constructor(public camService: CamService) {}

  ngOnInit(): void {
    this.camService.getAllCams().subscribe(value => {
      this.camService.camList = value;
      console.log(value);

      console.log(this.getPictureUrl(value[0].recordings[0].image));

      // this.camService.camList[0].recordings = [
      //   new Recording(new Date(2021, 4, 2, 13, 45), 'https://images.pexels.com/photos/620337/pexels-photo-620337.jpeg?cs=srgb&dl=pexels-tobi-620337.jpg&fm=jpg'),
      //   new Recording(new Date(2021, 4, 3, 8, 20), 'https://tse3.mm.bing.net/th?id=OIP.LoGFNYhIEyc8tHzt37DM4gHaFF&pid=Api'),
      //   new Recording(new Date(2021, 4, 3, 12, 30), 'https://i.pinimg.com/originals/57/07/a6/5707a6f4380abf089e41656b08842be8.jpg'),
      //   new Recording(new Date(2021, 4, 3, 14, 0), 'https://tse1.mm.bing.net/th?id=OIP.wuOrPV8vJkM3mQoBslx9nwHaEp&pid=Api'),
      //   new Recording(new Date(2021, 4, 4, 6, 55), 'https://tse3.mm.bing.net/th?id=OIP.KuzTzMWA58QnRgmM71EPxAHaHa&pid=Api'),
      //   new Recording(new Date(2021, 4, 4, 7, 35), 'https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2019/02/Landscapes-04-jeremy-flint.jpg?fit=1500%2C1000&ssl=1'),
      //   new Recording(new Date(2021, 4, 5, 9, 0), 'https://tse3.mm.bing.net/th?id=OIP.1q68ruGj8f1n-FrCduLtuAHaE8&pid=Api'),
      //   new Recording(new Date(2021, 4, 5, 11, 5), 'https://tse3.mm.bing.net/th?id=OIP._BM62hL-30VDUl1ylVqKzQHaEr&pid=Api'),
      //   new Recording(new Date(2021, 4, 5, 15, 15), 'https://tse3.mm.bing.net/th?id=OIP.SCxSKjNe391CpaX90OyR1wHaEK&pid=Api')
      // ];
      //
      // this.camService.camList[2].recordings = [
      //   new Recording(new Date(2021, 4, 5, 18, 12), 'https://tse1.mm.bing.net/th?id=OIP.cgDKhxRKDFr4A1Lo1ucngwHaE8&pid=Api')
      // ];
    });
  }

  checkDate(dayTime: Date): boolean {
    if (this.startDate && this.endDate) {
      if (dayTime >= this.startDate && dayTime <= this.endDate) {
        return true;
      }
      return false;
    }
    return true;
  }

  clearDateFilter(): void {
    console.log(this.startDate);
    console.log(this.endDate);
    console.log('---------------------');
    console.log(this.camService.camList[0].recordings[0].dayTime);

    this.startDate = null;
    this.endDate = null;
  }

  getPictureUrl(picUrl: string): string {
    return `data:image/jpg;base64,${picUrl}`;
  }
}
