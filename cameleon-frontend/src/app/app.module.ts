import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LiveViewComponent } from './live-view/live-view.component';
import {HeaderComponent} from './header/header.component';
import { CamSelectionComponent } from './pages/cam-selection/cam-selection.component';
import {HttpClientModule} from '@angular/common/http';
import { CamPopupComponent } from './pages/cam-selection/cam-popup/cam-popup.component';
import {ReactiveFormsModule} from "@angular/forms";
import { OverlayEditorComponent } from './pages/overlay-editor/overlay-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

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
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
