import { Component, OnInit } from '@angular/core';
import { Wage } from './wage';

@Component({
  selector: 'app-college-calculator',
  templateUrl: './college-calculator.component.html',
  styleUrls: ['./college-calculator.component.scss']
})
export class CollegeCalculatorComponent implements OnInit {
  uneducated: Wage = {
    startingWage: 9,
    raise: 2,
    cap: 20
  };
  educated: Wage = {
    startingWage: 15,
    raise: 2,
    cap: 35
  };
  constructor() { }

  ngOnInit() {
  }

}
