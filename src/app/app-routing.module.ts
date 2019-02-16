import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AudioStepComponent } from './audio-step.component';
import { AudioComponent } from './audio.component';

const routes: Routes = [
  { path: 'audio-step', component: AudioStepComponent },
  { path: 'audio', component: AudioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
