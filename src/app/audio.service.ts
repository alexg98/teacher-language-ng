import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subtitle } from "./play.model";
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AudioService {

    constructor(private http: HttpClient) { }  

    public getSubtitle(resource : string) : Observable<Subtitle[]>{
        var result : Subtitle[] = []; 
        this.http.get('assets/'+resource+'.txt', { responseType: 'text' })
            .subscribe(data => {
                var allTextLines = data.split(/\r\n|\n/);

                allTextLines.forEach((line, i) => {
                    if (i % 2 == 0) {
                        var seconds = this.getSeconds(allTextLines[i]);
                        if(seconds != null){
                            result.push(new Subtitle(allTextLines[i],seconds, allTextLines[i + 1]));
                        }            
                    }
                })

                result.map((sub, index) => {
                    sub.finish = result[index+1] != null ? result[index+1].second : null; 
                    return sub;
                });  
            });

        return of(result);    
    }

    private getSeconds(secondFormat : string ) : number{
        var varrFormat = secondFormat.split(':');
        if(varrFormat == null || varrFormat.length < 2){
          return null;
        }
        return Number(varrFormat[0]) * 60 + Number(varrFormat[1]);
    }
}  