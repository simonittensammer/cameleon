import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CamSelectionComponent} from './pages/cam-selection/cam-selection.component';
import {OverlayEditorComponent} from './pages/overlay-editor/overlay-editor.component';
import {RecordingsComponent} from "./pages/recordings/recordings.component";

const routes: Routes = [
  {
    path: '',
    component: CamSelectionComponent
  },
  {
    path: 'editor',
    component: OverlayEditorComponent
  },
  {
    path: 'recordings',
    component: RecordingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
