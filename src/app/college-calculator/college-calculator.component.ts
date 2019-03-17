import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-college-calculator',
  templateUrl: './college-calculator.component.html',
  styleUrls: ['./college-calculator.component.scss']
})
export class CollegeCalculatorComponent implements OnInit {
  lineChartData:Array<any> = [];
  lineChartLabels:Array<any> = [];
  breakEvenAge;
  formGroup: FormGroup;

  constructor( private fb: FormBuilder ) {
    this.formGroup = this.fb.group({
      common: this.fb.group({
        age: 18
      }),
      uneducated: this.fb.group({
        startingWage: 9,
        raise: 2
      }),
      educated:this.fb.group({
        startingWage: 15,
        raise: 2
      }),
      school: this.fb.group({
        cost: 30000,
        duration: 4
      })
    })
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(() => {
      this.buildChart();
    })
  }

  buildChart(){
    let uneducated={
      total: 0,
      data: [],
      wage: this.formGroup.get('uneducated.startingWage').value
    }
    let educated ={
      total: 0,
      data: [],
      wage: this.formGroup.get('educated.startingWage').value
    }
    let breakEvenData = [];
    this.lineChartLabels = [];
    this.breakEvenAge = undefined;

    for(let age = this.formGroup.get('common.age').value; age < 70; age++){
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
      uneducated.wage = uneducated.wage + (uneducated.wage * this.formGroup.get('uneducated.raise').value / 100);

      if(age < this.formGroup.get('common.age').value + this.formGroup.get('school.duration').value){
        //in school
        educated.total = educated.total - this.formGroup.get('school.cost').value;
      }else{
        //after graduation
        educated.total = educated.total + this.getYearlySalary(educated.wage);
        educated.wage = educated.wage + (educated.wage * this.formGroup.get('educated.raise').value / 100);
      }
    }
    this.lineChartData = [
      {data: educated.data, label: 'With school'},
      {data: uneducated.data, label: 'Without school'},
      {data: breakEvenData, label: 'Break Even Age', pointRadius: 20}
    ];
  }

  private getYearlySalary(wage){
    return wage * 40 * 52;
  }

}
