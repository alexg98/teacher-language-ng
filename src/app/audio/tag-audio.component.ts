import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AudioService } from '../audio.service';
import { Subtitle } from '../play.model';
import { Observable } from 'rxjs';
@Component({
    selector: 'tag-audio',    
    template: `
    <div class="row">
        <audio controls #audioOption style="width: 100%">
            <source src='assets/{{resource}}.mp3' name="audio" type="{{type}}" controls="true">
        </audio>
        <div class="text-center">
          <input class="btn-success btn-sm" type="button" value="0.3x" (click)="changeVelocity(0.3)"/>
          <input class="btn-success btn-sm" type="button" value="0.5x" (click)="changeVelocity(0.5)"/>
          <input class="btn-success btn-sm" type="button" value="0.6x" (click)="changeVelocity(0.6)"/>
          <input class="btn-success btn-sm" type="button" value="0.7x" (click)="changeVelocity(0.7)"/>
          <input class="btn-success btn-sm" type="button" value="0.8x" (click)="changeVelocity(0.8)"/>
          <input class="btn-success btn-sm" type="button" value="1.0x" (click)="changeVelocity(1.0)"/>
          <input class="btn-success btn-sm" type="button" value="1.25x" (click)="changeVelocity(1.25)"/>
          <input class="btn-success btn-sm" type="button" value="1.5x" (click)="changeVelocity(1.5)"/>
        </div>
    </div>    
        `,
    styleUrls: ['./tag-audio.component.css']    
})
export class TagAudioComponent implements OnInit {

    @ViewChild('audioOption') audioPlayerRef: ElementRef;
    resource: string;    
    type: string;
    subtitles : Subtitle[];    

    constructor(private audioService: AudioService){
        this.resource = 'extralarge';
        this.type = 'audio/mp3'
    }

    public onAudioPlay() {
        this.audioPlayerRef.nativeElement.play();
    }

    public onAudioPause() {
        this.audioPlayerRef.nativeElement.pause();
    }

    public currentTime(){
        return this.audioPlayerRef.nativeElement.currentTime;
    }

    public getControl(){
        return this.audioPlayerRef.nativeElement;
    }

    ngOnInit() {
        
    }

    public getSubtitleBySecond(second : number){
        var res = this.subtitles.find(sub => sub.second == second);
        if(res == undefined){
            return new Subtitle(null,0,null);
        }
        return res;
    }

    public getSubtitleBetweenSecond(second : number){        
        var res = this.subtitles.filter(sub => {
            return sub.second <= second && second < sub.finish});            
        if(res == undefined){
            return new Subtitle(null,0,null);
        }
        return res[0];
    }

    changeVelocity(velocity : number){
        this.audioPlayerRef.nativeElement.playbackRate = velocity;
    }

    loadSubtitles() : Observable<boolean> {
        return new Observable(
            observer => {
                this.audioService.getSubtitle(this.resource).subscribe( 
                    data => {
                        this.subtitles = data; 
                        console.log(data);
                        observer.next(true);
                        observer.complete();
                    })})
    }
}