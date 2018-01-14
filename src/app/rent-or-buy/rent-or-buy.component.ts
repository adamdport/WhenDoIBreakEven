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
      monthlyMortgage: null,
      sellingCosts: null
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
        price: 90000,
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
    this.calculated.buy.sellingCosts = this.getYearlyFromPercents(price, ['buy.realtorFees']);
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
      inflationAdjustedRent: this.formGroup.get('rent.rent').value,
      data: [],
    }

    let price = this.formGroup.get('buy.price').value;
    let inflation = this.formGroup.get('common.inflation').value / 100 + 1;
    let monthlyAvailable = this.calculated.monthlyAvailable;

    let buy ={
      // We inaccurately charge realtor fees immediately to make the chart's intersection more meaningful.
      // In reality, they'd be charged when the home sells. TODO: Does inflation make this inaccurate?
      total: this.formGroup.get('common.downPayment').value - this.getYearlyFromPercents(price, ['buy.closingCosts', 'buy.realtorFees']),
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
      rent.inflationAdjustedRent = rent.inflationAdjustedRent * inflation;
      rent.total = rent.total
        + (rent.total * (this.formGroup.get('rent.interest').value / 100)) // investment interest
        + (monthlyAvailable * 12) // available income
        - (rent.inflationAdjustedRent * 12); // rent

      //BUY:

      buy.data.push(buy.total);
      let buyLosses = ['buy.taxes', 'buy.upkeep', 'buy.insurance'];
      if (age < this.formGroup.get('buy.mortgageYears').value){
        buyLosses.push('buy.mortgageRate')
      }
      buy.total = buy.total
        + (monthlyAvailable * 12) // available income
        - this.getYearlyFromPercents(price,buyLosses);

      //TODO: invest excess


      monthlyAvailable = monthlyAvailable * inflation;
      if (!this.breakEvenAge && buy.total > rent.total){
        this.breakEvenAge = age;
        breakEvenData.push(buy.total);
      }else{
        breakEvenData.push(null);
      }
    }
    this.lineChartData = [
      {data: rent.data, label: 'Rent a house'},
      {data: buy.data, label: 'Buy a house'},
      {data: breakEvenData, label: 'Break Even Age', pointRadius: 20}
    ];
  }

}
