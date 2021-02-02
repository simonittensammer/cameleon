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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
