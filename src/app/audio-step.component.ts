import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TagAudioComponent } from './audio/tag-audio.component'
import { Subtitle } from './play.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './audio-step.component.html',
    styleUrls : ['./audio-step.component.css']
})
export class AudioStepComponent implements OnInit {

    @ViewChild(TagAudioComponent) tagAudio: TagAudioComponent;
    subtitleMsg : string;
    currentSubtitle : Subtitle;
    prevSubtitle : Subtitle;
    constructor() {}
    latency :number;

    ngOnInit() {        
        let hilo = this;        
        this.tagAudio.ngOnInit();
        this.tagAudio.resource = 'learn2';        
        this.tagAudio.loadSubtitles().subscribe( rest => {
            
            this.tagAudio.getControl().onplaying = function() {
                hilo.subtitleMsg = "<<  Listen  >>"
                this.controls = true;
            };
    
            this.tagAudio.getControl().onpause = function() {
                this.controls = false; 
            };
    
            this.tagAudio.getControl().onended = function() {
                
            };

            this.tagAudio.getControl().ontimeupdate = function() {                
                hilo.showSubtitle(parseInt(this.currentTime));
            };

            this.tagAudio.getControl().onseeked = function() {
      
            };            
        });           
    }   
    
    public repeat(){
        if(this.prevSubtitle != null){
            this.tagAudio.getControl().currentTime = this.prevSubtitle.second;
            this.tagAudio.onAudioPlay();
        }
    }

    private showSubtitle(currentTime : number){
        var tmp = this.tagAudio.getSubtitleBetweenSecond(currentTime);

        if(this.currentSubtitle != null && this.currentSubtitle.finish == currentTime){            
            this.tagAudio.onAudioPause();
            this.listenAndRepeat(this.currentSubtitle);
         }

        if(tmp != this.currentSubtitle && tmp.value != null){ 
            this.prevSubtitle = this.currentSubtitle;
            this.currentSubtitle = tmp;        
        }       
    }      

    private listenAndRepeat(currentSubtitle : Subtitle){
        console.log(this.latency);
        var delay = (currentSubtitle.finish - currentSubtitle.second ) * 1000;
        let data: Observable<string> = new Observable(
            observer => {                      
              observer.next("<<  Think  >>");
              setTimeout(() => {
                observer.next(currentSubtitle.value);
                observer.complete();
              },this.latency * 1000  );
            }
          )
          let subscription = data.subscribe(
            res => {
              this.subtitleMsg = res;
            },
            error => console.log(error),
            () => {                        
              setTimeout(() => {
                this.tagAudio.onAudioPlay();
              }, delay)
            }
          );        
    }
}      