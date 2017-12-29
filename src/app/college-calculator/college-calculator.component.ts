import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-college-calculator',
  templateUrl: './college-calculator.component.html',
  styleUrls: ['./college-calculator.component.scss']
})
export class CollegeCalculatorComponent implements OnInit {
  @ViewChild('collegeCalcForm') collegeCalcForm;
  lineChartData:Array<any> = [];
  lineChartLabels:Array<any> = [];
  breakEvenAge;
  common: FormGroup;
  uneducated: FormGroup;
  educated: FormGroup;
  school: FormGroup;

  constructor( private fb: FormBuilder ) {
    this.common = this.fb.group({
      age: 18
    });
    this.uneducated = this.fb.group({
      startingWage: 9,
      raise: 2
    });
    this.educated = this.fb.group({
      startingWage: 15,
      raise: 2
    });
    this.school = this.fb.group({
      cost: 30000,
      duration: 4
    });
  }

  ngOnInit() {
    this.buildChart();
    Observable.merge(
      this.common.valueChanges,
      this.uneducated.valueChanges,
      this.educated.valueChanges,
      this.school.valueChanges)
      .debounceTime(500)
      .subscribe(() => this.buildChart());
  }

  buildChart(){
    let uneducated={
      total: 0,
      data: [],
      wage: this.uneducated.get('startingWage').value
    }
    let educated ={
      total: 0,
      data: [],
      wage: this.educated.get('startingWage').value
    }
    let breakEvenData = [];
    this.lineChartLabels = [];
    this.breakEvenAge = undefined;

    for(let age = this.common.get('age').value; age < 70; age++){
      this.lineChartLabels.push(age);
      uneducated.data.push(uneducated.total);
      educated.data.push(educated.total);
      if (!this.breakEvenAge && educated.total > uneducated.total){
        this.breakEvenAge = age;
        breakEvenData.push(educated.total);
      }else{
        breakEvenData.push(null);
      }

      uneducated.total = uneducated.total + this.getYearlySalary(uneducated.wage);
      uneducated.wage = uneducated.wage + (uneducated.wage * this.uneducated.get('raise').value / 100);

      if(age < this.common.get('age').value + this.school.get('duration').value){
        //in school
        educated.total = educated.total - this.school.get('cost').value;
      }else{
        //after graduation
        educated.total = educated.total + this.getYearlySalary(educated.wage);
        educated.wage = educated.wage + (educated.wage * this.educated.get('raise').value / 100);
      }
    }
    this.lineChartData = [
      {data: uneducated.data, label: 'Without school'},
      {data: educated.data, label: 'With school'},
      {data: breakEvenData, label: 'Break Even Age', pointRadius: 20}
    ];
  }

  private getYearlySalary(wage){
    return wage * 40 * 52;
  }

}
