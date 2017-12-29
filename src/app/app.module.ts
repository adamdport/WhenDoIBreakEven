import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';
import {MatToolbarModule, MatButtonModule, MatTooltipModule, MatGridListModule, MatInputModule, MatFormFieldModule} from '@angular/material';
import { CollegeCalculatorComponent } from './college-calculator/college-calculator.component'

import { AppComponent } from './app.component';

import { ChartsModule } from 'ng2-charts';


const appRoutes: Routes = [
  { path: '', component: CollegeCalculatorComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    CollegeCalculatorComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule, MatButtonModule, MatTooltipModule, MatGridListModule, MatInputModule, MatFormFieldModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
