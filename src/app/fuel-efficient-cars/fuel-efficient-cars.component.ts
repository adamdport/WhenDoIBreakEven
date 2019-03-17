import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-fuel-efficient-cars',
  templateUrl: './fuel-efficient-cars.component.html',
  styleUrls: ['./fuel-efficient-cars.component.scss']
})
export class FuelEfficientCarsComponent implements OnInit{
  lineChartData:Array<any> = [];
  lineChartLabels:Array<any> = [];
  breakEvenAge;
  formGroup: FormGroup;

  constructor( private fb: FormBuilder ) {
    this.formGroup = this.fb.group({
      common: this.fb.group({
        milesPerYear: 10000,
        distanceToWork: 20,
        costPerGallon: 3
      }),
      inefficient: this.fb.group({
        cost: 15000,
        mileage: 25
      }),
      efficient:this.fb.group({
        cost: 25000,
        mileage: 40
      })
    })
  }

  ngOnInit(){
    this.formGroup.get('common.distanceToWork').valueChanges
      .pipe(
        debounceTime(500)
      ).subscribe((newValue) => this.calculateMilesPerYear(newValue));

    this.formGroup.valueChanges.subscribe(() => {
      this.buildChart();
    })
  }

  calculateMilesPerYear(distanceToWork){
    let milesPerYear = distanceToWork * 2 * 5 * 52 * 1.2; //add 20%
    this.formGroup.get('common.milesPerYear').setValue(milesPerYear);
  }

  buildChart(){
    let inefficient={
      total: this.formGroup.get('inefficient.cost').value,
      data: [],
    }
    let efficient ={
      total: this.formGroup.get('efficient.cost').value,
      data: [],
    }
    let breakEvenData = [];
    this.lineChartLabels = [];
    this.breakEvenAge = undefined;

    for(let age = 0; age < 30; age++){
      this.lineChartLabels.push(age);
      inefficient.data.push(inefficient.total);
      efficient.data.push(efficient.total);
      if (!this.breakEvenAge && efficient.total < inefficient.total){
        this.breakEvenAge = age;
        breakEvenData.push(efficient.total);
      }else{
        breakEvenData.push(null);
      }

      inefficient.total = inefficient.total + this.getAnnualFuelCost(this.formGroup.get('inefficient.mileage').value);
      efficient.total = efficient.total + this.getAnnualFuelCost(this.formGroup.get('efficient.mileage').value);
    }
    this.lineChartData = [
      {data: efficient.data, label: 'Efficient Car'},
      {data: inefficient.data, label: 'Cheaper Car'},
      {data: breakEvenData, label: 'Break Even Age', pointRadius: 20}
    ];
  }

  private getAnnualFuelCost(mpg){
    return (this.formGroup.get('common.milesPerYear').value / mpg)*this.formGroup.get('common.costPerGallon').value;
  }
}
