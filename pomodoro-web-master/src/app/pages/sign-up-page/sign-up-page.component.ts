import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {
  public formSignUp: FormGroup;
  public hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) {
    
    this.formSignUp = this.formBuilder.group({
      'name': ['', Validators.required],
      'controlNumber': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit(): void {
  }

  private initializeForm() {
    this.formSignUp = this.formBuilder.group({
      'name': ['', Validators.required],
      'controlNumber': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }


  signup() {
    if (this.formSignUp.valid) {
      this.userService.signUp(this.formSignUp.value).subscribe((response: any) => {
        console.log(response);
      }, error => {
        console.log(error);
      });
    } else {
      console.log('Escriba los campos obligatorios');
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  get email() {
    return this.formSignUp.controls['email'];
  }

  get password() {
    return this.formSignUp.controls['password'];
  }

}
