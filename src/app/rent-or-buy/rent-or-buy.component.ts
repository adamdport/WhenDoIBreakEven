import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rent-or-buy',
  templateUrl: './rent-or-buy.component.html',
  styleUrls: ['./rent-or-buy.component.scss']
})
export class RentOrBuyComponent implements OnInit {
  lineChartData:Array<any> = [];
  lineChartLabels:Array<any> = [];
  breakEvenAge;
  formGroup: FormGroup;

  calculated = {
    monthlyAvailable: null,
    buy: {
      totalMonthly: null,
      closingCosts: null,
      annualTaxes: null,
      annualUpkeep: null,
      annualInsurance: null,
      annualInterest: null,
      monthlyMortgage: null
    }
  };

  constructor( private fb: FormBuilder ) {
    this.formGroup = this.fb.group({
      common: this.fb.group({
        downPayment: 10000,
        inflation: 2,
        runtime: 40
      }),
      rent: this.fb.group({
        rent: 800,
        interest: 8
      }),
      buy: this.fb.group({
        price: 100000,
        closingCosts: 10,
        taxes: 4,
        upkeep: 1,
        insurance: .25,
        mortgageYears: 30,
        mortgageRate: 5,
        realtorFees: 6
      })
    });
  }

  ngOnInit(){
    this.formGroup.valueChanges.debounceTime(500).subscribe(() => {
      this.buildChart();
    })
  }

  calculateAutomaticValues(){
    let price = this.formGroup.get('buy.price').value; // in today's dollars so it's actually meaningful to people

    this.calculated.buy.totalMonthly = this.getAnnualBuyCost(price) / 12;
    this.calculated.buy.annualTaxes = this.getYearlyFromPercents(price, ['buy.taxes']);
    this.calculated.buy.annualUpkeep = this.getYearlyFromPercents(price, ['buy.upkeep']);
    this.calculated.buy.annualInsurance = this.getYearlyFromPercents(price, ['buy.insurance']);
    this.calculated.buy.annualInterest = this.getYearlyFromPercents(price, ['buy.mortgageRate']);
    this.calculated.buy.monthlyMortgage = this.getMortgagePayment();

    this.calculated.buy.closingCosts = this.getYearlyFromPercents(price, ['buy.closingCosts']);

    this.calculated.monthlyAvailable = Math.max(this.formGroup.get('rent.rent').value, this.calculated.buy.totalMonthly);
  }

  getYearlyFromPercents(price:number, sources: string[]): number{
    let percentageSum = sources
      .map((source) => this.formGroup.get(source).value)
      .reduce((accumulator, currentValue) => accumulator + currentValue);
      return percentageSum / 100 * price;
  }

  getMortgagePayment(){
    let housePrice = this.formGroup.get('buy.price').value - this.formGroup.get('common.downPayment').value;
    let numMonths = this.formGroup.get('buy.mortgageYears').value * 12;
    let monthlyInterest = this.formGroup.get('buy.mortgageRate').value / 100 / 12; //interest is charged annually so it doesn't compound
    return housePrice*(monthlyInterest * Math.pow((1 + monthlyInterest), numMonths))/(Math.pow((1 + monthlyInterest), numMonths) - 1);
  }

  getAnnualBuyCost(price:number){
    return (this.getMortgagePayment() * 12) + this.getYearlyFromPercents(price, ['buy.taxes', 'buy.upkeep', 'buy.insurance']);
  }

  buildChart(){
    this.calculateAutomaticValues();

    let rent={
      total: this.formGroup.get('common.downPayment').value,
      data: [],
    }
    let buy ={
      total: -this.formGroup.get('buy.price').value + this.formGroup.get('common.downPayment').value,
      data: [],
    }
    let breakEvenData = [];
    this.lineChartLabels = [];
    this.breakEvenAge = undefined;
    let runtime = this.formGroup.get('common.runtime').value;

    for(let age = 0; age < runtime; age++){
      this.lineChartLabels.push(age);

      //RENT:
      rent.data.push(rent.total);
      rent.total = rent.total
        + (rent.total * (this.formGroup.get('rent.interest').value / 100)) // investment interest
        + (this.calculated.monthlyAvailable * 12) // available income
        - (this.formGroup.get('rent.rent').value * 12); // rent

      //buy.data.push(buy.total);
      // buy.data.push(buy.total - () + );
      // if (!this.breakEvenAge && efficient.total < inefficient.total){
      //   this.breakEvenAge = age;
      //   breakEvenData.push(efficient.total);
      // }else{
      //   breakEvenData.push(null);
      // }
      //
      // inefficient.total = inefficient.total + this.getAnnualFuelCost(this.formGroup.get('inefficient.mileage').value);
      // efficient.total = efficient.total + this.getAnnualFuelCost(this.formGroup.get('efficient.mileage').value);
    }
    this.lineChartData = [
      {data: rent.data, label: 'Rent a house'},
      {data: buy.data, label: 'Buy a house'},
      {data: breakEvenData, label: 'Break Even Age', pointRadius: 20}
    ];
  }

}
