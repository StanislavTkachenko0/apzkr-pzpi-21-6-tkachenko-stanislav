import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {HashService} from "../../services/api/hash.service";

@Component({
  selector: 'introduction-page',
  templateUrl: './introduction-page.component.html'
})
export class IntroductionPageComponent implements OnInit, AfterViewInit, OnDestroy{

  destroy: Subject<any> = new Subject<any>();

  constructor(private hashService: HashService) {
  }

  ngOnDestroy(): void {
    this.destroy.complete();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }
}
