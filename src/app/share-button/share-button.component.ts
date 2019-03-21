import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent implements OnInit{
  @Input() formGroup: FormGroup;
  formControl: FormControl = new FormControl();

  constructor(private router: Router) { }

  ngOnInit(){
    this.formGroup.valueChanges.subscribe(value => {
      debugger;
      this.formControl.setValue("foo");
    });
  }
}
