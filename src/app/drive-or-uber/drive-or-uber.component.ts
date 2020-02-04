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

  calculated = {
    buy: {
      gas: null,
      otherCosts: null
    },
    uber: null
  };

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
        tripsPerYear: 2
      })
    })
  }

  ngOnInit(){
    this.formGroup.valueChanges.subscribe(() => {
      this.buildChart();
    })
  }

  getBuyCost(mode: 'upFront' | 'monthly' = 'monthly', year: number = 0){
    const payment = this.formGroup.get('drive.payment').value;
    let upFront;
    let monthly; 
    //buy
    if (payment.buyOrLease === PaymentType.BUY){

      //cash
      if (payment.cashOrFinance === BuyType.CASH){
        upFront = payment.cashCost;
        monthly = 0;
      }

      //finance
      else{
        upFront = payment.financeDown;
        monthly = year < payment.financeDuration ? payment.financePayment : 0;
      }
    }
    
    //lease
    else {
      upFront = payment.financeDown;
      monthly = payment.leaseCost;
    }

    return mode === 'upFront' ? upFront : monthly;
  }
  
  getYearlyUberCost(){
    const form = this.formGroup.value;
    const workCostPerWeek = form.uber.costToWork * 2 * form.common.workPerWeek;
    const errandsCostPerWeek = form.uber.costToErrands * 2 * form.common.errandsPerWeek;
    
    const tripsCostPerYear = form.uber.rentalForTrip * form.uber.tripsPerYear;

    const uberCostPerYear = this.calculated.uber = ((workCostPerWeek + errandsCostPerWeek)*52);
    return uberCostPerYear + tripsCostPerYear;
  }

  getYearlyBuyCost(yearNumber: number){
    const getYearlyGasCosts = () => {
      const workMilesPerWeek = form.common.workPerWeek * form.drive.distanceToWork * 2;
      const errandsMilesPerWeek = form.common.errandsPerWeek * form.drive.distanceToWork * 2;
      /* Yearly trips don't need to be added here. We assume their rental in the uber scenario gets the same mpg
           as their buy scenario car*/

      return ((workMilesPerWeek + errandsMilesPerWeek)/form.drive.mileage) * 52 * form.drive.costPerGallon;
    };

    const getYearlyOtherCosts = () => {
      const workParkingPerYear = form.common.workPerWeek * 52 * form.drive.workParking;
      const errandParkingPerYear = form.common.errandsPerWeek * 52 * form.drive.errandParking;
      return workParkingPerYear + errandParkingPerYear + form.drive.insurance + form.drive.upkeep + form.drive.registration + form.drive.inspection;
    }

    const form = this.formGroup.value;
    const carPayment = this.getBuyCost('monthly',yearNumber) * 12;
    const gas = this.calculated.buy.gas = getYearlyGasCosts();
    const other = this.calculated.buy.otherCosts = getYearlyOtherCosts();

    return carPayment + gas + other;
  }

  buildChart(){
    let drive= {
      total: this.getBuyCost('upFront'),
      monthsRemaining: this.formGroup.get('drive.payment.financeDuration').value * 12,
      data: [],
    }
    let uber = {
      total: 0,
      data: [],
    }
    let breakEvenData = [];
    this.lineChartLabels = [];
    this.breakEvenAge = undefined;

    for(let age = 0; age < 30; age++){
      this.lineChartLabels.push(age);
      drive.data.push(drive.total);
      uber.data.push(uber.total);
      if (!this.breakEvenAge && uber.total > drive.total){
        this.breakEvenAge = age;
        breakEvenData.push(uber.total);
      }else{
        breakEvenData.push(null);
      }

      drive.total = drive.total + this.getYearlyBuyCost(age);
      uber.total = uber.total + this.getYearlyUberCost();
    }
    this.lineChartData = [
      {data: uber.data, label: 'Take an Uber everywhere'},
      {data: drive.data, label: 'Buy a car'},
      {data: breakEvenData, label: 'Break Even Age', pointRadius: 20}
    ];
  }

}
