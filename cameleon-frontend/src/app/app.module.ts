import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LiveViewComponent} from './live-view/live-view.component';
import {HeaderComponent} from './header/header.component';
import {CamSelectionComponent} from './pages/cam-selection/cam-selection.component';
import {HttpClientModule} from '@angular/common/http';
import {CamPopupComponent} from './pages/cam-selection/cam-popup/cam-popup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OverlayEditorComponent} from './pages/overlay-editor/overlay-editor.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {ColorPickerModule} from 'ngx-color-picker';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    LiveViewComponent,
    HeaderComponent,
    CamSelectionComponent,
    CamPopupComponent,
    OverlayEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    ColorPickerModule,
    FormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
