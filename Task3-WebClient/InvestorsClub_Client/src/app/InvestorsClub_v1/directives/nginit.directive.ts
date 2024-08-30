import { Directive, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[ngInit]'
})
export class NgInitDirective {

    //@Input() isLast: boolean;

    @Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        //console.log("init", this.initEvent);
       // if (this.isLast) {
            setTimeout(() => this.initEvent.emit(), 10);
        //}
    }
}
