import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  @Input() label: String;
  @Input() max: number;
  @Input() min: number;
  @Input() step: number;
  @Input() value: number;
  @Output() valueChange:EventEmitter<number> = new EventEmitter<number>();

  sliderChanged($event){
    this.valueChange.emit($event.value);
  }

}
