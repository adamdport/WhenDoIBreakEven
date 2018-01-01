import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss']
})
export class CommonLayoutComponent implements OnInit {
  @Output() build = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  buildButtonClicked(){
    this.build.emit();
  }

}
