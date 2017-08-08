import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';
import {MdToolbarModule, MdButtonModule, MdSliderModule, MdTooltipModule, MdGridListModule} from '@angular/material';
import { CollegeCalculatorComponent } from './college-calculator/college-calculator.component'

import { AppComponent } from './app.component';
import { SliderComponent } from './slider/slider.component';

const appRoutes: Routes = [
  { path: '', component: CollegeCalculatorComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    CollegeCalculatorComponent,
    SliderComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MdToolbarModule, MdButtonModule, MdSliderModule, MdTooltipModule, MdGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
