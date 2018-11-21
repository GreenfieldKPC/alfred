import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
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
    private formBuilder: FormBuilder, private http: HttpClient, private router: Router
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
    this.choreForm.value.electedCategory = this.selectedCategory
    console.log(this.choreForm.value);
    this.http.post("/add",this.choreForm.value).subscribe((data) => {
      console.log(data);
      if (data === false) {
        this.router.navigateByUrl('/dashboard');

      } else {
      }
    })  
  }
}
