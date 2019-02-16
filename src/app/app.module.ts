import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AudioStepComponent } from './audio-step.component';
import { AudioComponent } from './audio.component';
import { TagAudioComponent } from './audio/tag-audio.component';

@NgModule({
  declarations: [
    AppComponent,
    AudioStepComponent,
    AudioComponent,
    TagAudioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }