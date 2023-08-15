import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EnquiryListService } from '../service/enquiry-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.css'],
})
export class CreateRegistrationComponent implements OnInit {
  gymForm: any;
  public packages = ['Monthly', 'Quarterly', 'Yearly'];
  importantLists: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
    'My Choice not in List',
  ];
  genders:string[] = ['Male' , 'Female']
  requiredTrainer:any = 'male'
  Agree:string[] = ['Yes','No']

  userIdToupdate!: number;
  isUpdateisActive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: EnquiryListService,
    private router: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.gymForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requiredTrainer: [''],
      packages: [''],
      important: [''],
      havegtmBefore: [''],
      enquiryDate: [''],
    });

    this.gymForm.controls['height'].valueChanges.subscribe((res: any) => {
      this.calculateBmi(res);
    });

    this.router.params.subscribe((params) => {
      this.userIdToupdate = params['id'];
      this.api
        .getRegisteredUserId(this.userIdToupdate)
        .subscribe(result => {
          this.isUpdateisActive = true;
          this.fillFormtoUpdate(result);
        });
    });
  }

  onSubmit() {
    this.api.postRegistration(this.gymForm.value).subscribe((res) => {
      this.gymForm.reset();
    });
  }

  calculateBmi(value: number) {
    const weight = this.gymForm.value.weight; // weight in kilograms
    const height = value; // height in meters
    const bmi = weight / (height * height);
    this.gymForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.gymForm.controls['bmiResult'].patchValue('Underweight');
        break;
      case bmi >= 18.5 && bmi < 25:
        this.gymForm.controls['bmiResult'].patchValue('Normal');
        break;
      case bmi >= 25 && bmi < 30:
        this.gymForm.controls['bmiResult'].patchValue('Overweight');
        break;

      default:
        this.gymForm.controls['bmiResult'].patchValue('Obese');
        break;
    }
  }

  fillFormtoUpdate(user: User) {
    this.gymForm.setValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requiredTrainer: user.requiredTrainer,
      packages: user.packages,
      important: user.important,
      havegtmBefore: user.havegtmBefore,
      enquiryDate: user.enquiryDate,
    });
  }

  onUpdate() {
    this.api
      .updateRegisterUser(this.gymForm.value, this.userIdToupdate)
      .subscribe((res) => {
        this.gymForm.reset();
        this.route.navigate(['list']);
      });
  }
}
