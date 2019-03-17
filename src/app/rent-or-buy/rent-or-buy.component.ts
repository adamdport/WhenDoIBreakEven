import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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
        inflation: 2
      }),
      rent: this.fb.group({
        rent: 800,
        interest: 8
      }),
      buy: this.fb.group({
        price: 90000,
        closingCosts: 5,
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
    this.formGroup.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
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
    let stickerPrice = this.formGroup.get('buy.price').value
    let housePrice = stickerPrice
      - this.formGroup.get('common.downPayment').value;
      + this.getYearlyFromPercents(stickerPrice, ['buy.closingCosts']);
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
    let yearlyAvailable = this.calculated.monthlyAvailable * 12;
    let yearlyMortgage = this.getMortgagePayment() * 12;

    let buy ={
      total: this.formGroup.get('common.downPayment').value,
      mortgageRemaining: price - this.formGroup.get('common.downPayment').value + this.getYearlyFromPercents(price, ['buy.closingCosts']),
      investmentTotal: 0,
      data: [],
    }
    let breakEvenData = [];
    this.lineChartLabels = [];
    this.breakEvenAge = undefined;

    this.lineChartLabels.push(0);
    rent.data.push(rent.total);
    buy.data.push(buy.total);
    breakEvenData.push(null);

    for(let age = 1; age < 50; age++){
      this.lineChartLabels.push(age);

      //RENT:
      rent.inflationAdjustedRent = rent.inflationAdjustedRent * inflation;
      rent.total = rent.total
        + (rent.total * (this.formGroup.get('rent.interest').value / 100)) // investment interest
        + (yearlyAvailable) // available income
        - (rent.inflationAdjustedRent * 12); // rent
      rent.data.push(rent.total);

      //BUY:
      let investmentInterest = 0;
      let housePayment;
      let mortgageInterest = 0;
      if (buy.mortgageRemaining > 0){ //still have mortgage
        mortgageInterest = buy.mortgageRemaining * this.formGroup.get('buy.mortgageRate').value / 100;
        housePayment = Math.min(yearlyAvailable, buy.mortgageRemaining); //pay the payments, or whatever's left. TODO: invest the remainder
        buy.mortgageRemaining = buy.mortgageRemaining + mortgageInterest - (yearlyMortgage);
      }else{ //mortgage is paid! Start investing
        housePayment = 0;
      }

      investmentInterest = buy.investmentTotal * (this.formGroup.get('rent.interest').value / 100);
      if (yearlyAvailable > housePayment){
        buy.investmentTotal = buy.investmentTotal + (yearlyAvailable - housePayment);
      }

      buy.total = buy.total
        + (yearlyAvailable) // available income
        - this.getYearlyFromPercents(price,['buy.taxes', 'buy.upkeep', 'buy.insurance'])
        - mortgageInterest
        + investmentInterest;

      yearlyAvailable = yearlyAvailable * inflation;
      price = price * inflation;

      let buyTotalMinusSellingCosts = buy.total - this.getYearlyFromPercents(price, ['buy.realtorFees']);
      buy.data.push(buyTotalMinusSellingCosts); //assume they just sold the house and subtract realtor fees

      if (!this.breakEvenAge && (buyTotalMinusSellingCosts > rent.total)){
        this.breakEvenAge = age;
        breakEvenData.push(buyTotalMinusSellingCosts);
      }else{
        breakEvenData.push(null);
      }

      if(this.breakEvenAge && (age-this.breakEvenAge === 3)){
        break;
      }
    }
    this.lineChartData = [
      {data: rent.data, label: 'Rent a house'},
      {data: buy.data, label: 'Buy a house'},
      {data: breakEvenData, label: 'Break Even Age', pointRadius: 20}
    ];
  }

}
