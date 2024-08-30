import {NgModule} from "@angular/core";
import {NgInitDirective} from "./nginit.directive";

@NgModule({
    declarations: [
        NgInitDirective
    ],
    exports: [
        NgInitDirective
    ]
})
export class NginitModule {}
