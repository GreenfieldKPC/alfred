import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent{
  choreForm: FormGroup;
  categoryLists = ['House Hold', 'Lawn Care', 'Pet Care'];
  selectedCategory: string;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(e) {
    
    this.choreForm = this.formBuilder.group({
      // category: [''],
      description: [''],
      location: [''],
      suggestedPay: ['$'],
      startTime:['']
    })
    this.selectedCategory = e;
  }
  addChore() {
    console.log(this.choreForm.value);
    console.log(this.selectedCategory);
  }
}
