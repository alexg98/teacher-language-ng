export class Play {
    second: number;
    value: string;    

    constructor(second: number, value: string) {
      this.second = second;
      this.value = value;      
    }
}

export class Subtitle {
    time: string;
    second: number;
    value: string;    
    finish : number;
    constructor(time: string, second: number, value: string) {
        this.time = time;
        this.second = second;
        this.value = value;      
    }
}