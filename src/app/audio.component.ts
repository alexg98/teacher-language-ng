import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Play } from './play.model';

@Component({
  selector: 'app-root',
  templateUrl: './audio.component.html'  
})
export class AudioComponent implements OnInit {

  @ViewChild('audioOption') audioPlayerRef: ElementRef;

  subtitles: any[] = [];
  currentTime: number;
  velocity: number;
  latency: number;
  velocityMsg: string;
  latencyMsg: string;
  myValue: number;
  myLatency: number;

  msgCurrent: string = "";

  position: number = 0;
  isFront: boolean = true;
  currentBefore: number;
  buttonStatus: boolean = false;

  resource : string; 

  progressAud : number;
  duration : number;

  constructor(private http: HttpClient) {
    this.myValue = 1;
    this.myLatency = 1;
    this.velocity = this.myValue;
    this.latency = this.myLatency;
    this.resource = 'extralarge';
    this.progressAud = 0;    
  }

  changeVelocity(ranger: number) {
    this.velocity = ranger;
    this.audioPlayerRef.nativeElement.playbackRate = this.velocity;
    this.velocityMsg = 'V ' + this.velocity;
  }

  changeLatency(ranger: number) {
    this.latency = ranger;
    this.latencyMsg = String(this.latency);
  }

  onPause() {
    this.audioPlayerRef.nativeElement.autoplay = true;
    this.audioPlayerRef.nativeElement.pause();    
  }

  onAudioPlay() {       

    this.audioPlayerRef.nativeElement.playbackRate = this.velocity;
    if(this.audioPlayerRef.nativeElement.paused){
      this.audioPlayerRef.nativeElement.play();
    }else{
      this.audioPlayerRef.nativeElement.currentTime = 0;    
    this.audioPlayerRef.nativeElement.play();  
    }    
    this.duration = this.audioPlayerRef.nativeElement.duration;
    this.readSubtitles();
  }

  next() {
    this.step(true);
  }

  prev() {
    this.step(false);  
  }

  repeat() {
    this.action(this.currentBefore);    
  }

  step(isFront : boolean){
    this.currentBefore = this.position;

    if (isFront && !this.isFront) {
      this.position++;
    }
    if (!isFront && this.isFront) {
      this.position--;
    }
    if(isFront){
      this.action(this.position);
      this.position++;
    }else{
      this.position--;
      this.action(this.position);
    }
    this.isFront = isFront;
  } 

  action(position: number) {
    this.buttonStatus = true;
    var currentPoint = this.subtitles[position];

    var cantSeconds = this.subtitles[position + 1].second - currentPoint.second;
    this.audioPlayerRef.nativeElement.currentTime = currentPoint.second;
    this.audioPlayerRef.nativeElement.play();

    var data: Observable<string> = new Observable(
      observer => {
        observer.next("<<< Listen >>>");
        setTimeout(() => {
          this.audioPlayerRef.nativeElement.pause();
          observer.next("<<< Waiting >>>");
          observer.complete();
        }, ((cantSeconds) * 1000) / this.velocity);
      }
    )
    let subscription = data.subscribe(
      res => {
        this.msgCurrent = res;
      },
      error => console.log(error),
      () => {
        setTimeout(() => {
          this.buttonStatus = false;
          this.msgCurrent = currentPoint.value;
        }, this.latency * 1000)
      }
    );
  }

  readSubtitles() {
    setInterval(() => {
      this.currentTime = this.audioPlayerRef.nativeElement.currentTime;      
      this.getMonitoring();
      this.progressAud = (100/this.duration) * this.currentTime ;

    }, 500);
  } 

  getMonitoring() {
    var res = this.subtitles.filter(time => this.currentTime >= time.second)
      .sort(function (a: Play, b: Play) { return b.second - a.second });
    this.msgCurrent = res != null && res.length > 0 ? res[0].value : "";
  }

  ngOnInit() {    
    this.http.get('assets/'+this.resource+'.txt', { responseType: 'text' })
      .subscribe(data => {
        var allTextLines = data.split(/\r\n|\n/);
        for (var i = 0; i < allTextLines.length; i++) {
          if (i % 2 == 0) {
            var seconds = this.getSeconds(allTextLines[i]);
            if(seconds != null){
              this.subtitles.push(new Play(seconds, allTextLines[i + 1]));
            }            
          }
        }        
      });

      let val1 = this.audioPlayerRef.nativeElement.onended = function() {
        console.log("The audio has ended");
      };
  
      let val = this.audioPlayerRef.nativeElement.oncanplay = function() {
        console.log("Can start playing video");
      };

      let val2 = this.audioPlayerRef.nativeElement.onpause = function() {
        console.log("The video has been paused");
      };
      let val3 = this.audioPlayerRef.nativeElement.onseeking = function() {
        console.log("Seek operation began!");
      };

      let val4 = this.audioPlayerRef.nativeElement.onplay = function() {
        console.log("The video has started to play");
      };

      let val5 = this.audioPlayerRef.nativeElement.onplaying = function() {
        console.log("The video is now playing");
      };
  }  

  private getSeconds(secondFormat : string ) : number{    
    var varrFormat = secondFormat.split(':');
    if(varrFormat == null || varrFormat.length < 2){
      return null;
    }
    return Number(varrFormat[0]) * 60 + Number(varrFormat[1]);
  }
}