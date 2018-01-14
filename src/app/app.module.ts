import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';
import {MatToolbarModule, MatButtonModule, MatGridListModule, MatInputModule, MatFormFieldModule} from '@angular/material';
import { CollegeCalculatorComponent } from './college-calculator/college-calculator.component'
import { FuelEfficientCarsComponent } from './fuel-efficient-cars/fuel-efficient-cars.component';

import { AppComponent } from './app.component';

import { ChartsModule } from 'ng2-charts';
import { CommonLayoutComponent } from './common-layout/common-layout.component';
import { RentOrBuyComponent } from './rent-or-buy/rent-or-buy.component';


const appRoutes: Routes = [
  { path: 'college', component: CollegeCalculatorComponent },
  { path: 'cars', component: FuelEfficientCarsComponent },
  { path: 'rentorbuy', component: RentOrBuyComponent },
  { path: '**', redirectTo: 'college' }
];

@NgModule({
  declarations: [
    AppComponent,
    CollegeCalculatorComponent,
    FuelEfficientCarsComponent,
    CommonLayoutComponent,
    RentOrBuyComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule, MatButtonModule, MatGridListModule, MatInputModule, MatFormFieldModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
