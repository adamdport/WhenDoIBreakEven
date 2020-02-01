import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

enum PaymentType {
  BUY, LEASE
}

enum BuyType {
  CASH, FINANCE
}

@Component({
  selector: 'app-drive-or-uber',
  templateUrl: './drive-or-uber.component.html',
  styleUrls: ['./drive-or-uber.component.scss']
})
export class DriveOrUberComponent implements OnInit {
  lineChartData:Array<any> = [];
  lineChartLabels:Array<any> = [];
  breakEvenAge;
  formGroup: FormGroup;
  PaymentType = PaymentType;
  BuyType = BuyType;

  constructor( private fb: FormBuilder ) {
    this.formGroup = this.fb.group({
      common: this.fb.group({
        workPerWeek: 5,
        errandsPerWeek: 2,
      }),
      drive: this.fb.group({
        payment: this.fb.group({
          buyOrLease: PaymentType.BUY, 
          cashOrFinance: BuyType.CASH,
          cashCost: 15000,
          financeDuration: 5,
          financeDown: 0,
          financePayment: 400,
          leaseCost: 300
        }),
        mileage: 25,
        costPerGallon: 2.50,
        distanceToWork: 10,
        distanceToErrands: 10,
        insurance: 600,
        upkeep: 500,
        registration: 75,
        inspection: 20,
        workParking: 0,
        errandParking: 0
      }),
      uber:this.fb.group({
        costToWork: 10,
        costToErrands: 10,
        rentalForTrip: 200,
        tripsPerYear: 6
      })
    })
  }

  ngOnInit(){
    this.formGroup.valueChanges.subscribe(() => {
      this.buildChart();
    })
  }

  buildChart(){
    // let inefficient={
    //   total: this.formGroup.get('inefficient.cost').value,
    //   data: [],
    // }
    // let efficient ={
    //   total: this.formGroup.get('efficient.cost').value,
    //   data: [],
    // }
    // let breakEvenData = [];
    // this.lineChartLabels = [];
    // this.breakEvenAge = undefined;

    // for(let age = 0; age < 30; age++){
    //   this.lineChartLabels.push(age);
    //   inefficient.data.push(inefficient.total);
    //   efficient.data.push(efficient.total);
    //   if (!this.breakEvenAge && efficient.total < inefficient.total){
    //     this.breakEvenAge = age;
    //     breakEvenData.push(efficient.total);
    //   }else{
    //     breakEvenData.push(null);
    //   }

    //   inefficient.total = inefficient.total + this.getAnnualFuelCost(this.formGroup.get('inefficient.mileage').value);
    //   efficient.total = efficient.total + this.getAnnualFuelCost(this.formGroup.get('efficient.mileage').value);
    // }
    // this.lineChartData = [
    //   {data: efficient.data, label: 'Efficient Car'},
    //   {data: inefficient.data, label: 'Cheaper Car'},
    //   {data: breakEvenData, label: 'Break Even Age', pointRadius: 20}
    // ];
  }

}
