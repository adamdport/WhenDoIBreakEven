import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-college-calculator',
  templateUrl: './college-calculator.component.html',
  styleUrls: ['./college-calculator.component.scss']
})
export class CollegeCalculatorComponent implements OnInit {
  lineChartData:Array<any> = [];
  lineChartLabels:Array<any> = [];

  common = {
    age: 18
  }
  uneducated = {
    startingWage: 9,
    raise: 2
  };
  educated = {
    startingWage: 15,
    raise: 2
  };
  school = {
    cost: 30000,
    duration: 4
  }
  constructor() { }

  ngOnInit() {
    this.buildChart();
  }

  buildChart(){
    let uneducated={
      total: 0,
      data: [],
      wage: this.uneducated.startingWage
    }
    let educated ={
      total: 0,
      data: [],
      wage: this.educated.startingWage
    }

    for(let age = this.common.age; age < 70; age++){
      this.lineChartLabels.push(age);
      uneducated.data.push(uneducated.total);
      educated.data.push(educated.total);

      uneducated.total = uneducated.total + this.getYearlySalary(uneducated.wage);
      uneducated.wage = uneducated.wage + (uneducated.wage * this.uneducated.raise / 100);

      if(age < this.common.age + this.school.duration){
        //in school
        educated.total = educated.total - this.school.cost;
      }else{
        //after graduation
        educated.total = educated.total + this.getYearlySalary(educated.wage);
        educated.wage = educated.wage + (educated.wage * this.educated.raise / 100);
      }
    }
    this.lineChartData = [
      {data: uneducated.data, label: 'Without school'},
      {data: educated.data, label: 'With school'},
    ];
  }

  private getYearlySalary(wage){
    return wage * 40 * 52;
  }

}
