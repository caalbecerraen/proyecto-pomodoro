import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  public formLogin: FormGroup;
  public hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationsService) {
      this.formLogin = this.formBuilder.group({
        'email': ['', Validators.compose([Validators.required, Validators.email])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      });
    }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.formLogin = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  login() {
    if (this.formLogin.valid) {
      this.userService.login(this.formLogin.value).subscribe((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/']);
        this.notificationService.success('¡Bienvenido!', 'Para tener una mejor experiencia y evitar distracciones se te recomienda presionar F11')
      }, error => {
        console.log(error);
      });
    } else {
      console.log('Información incorrecta');
    }
  }

  redirectToSignUp() {
    this.router.navigate(['/signup']);
  }

  get email() {
    return this.formLogin.controls['email'];
  }

  get password() {
    return this.formLogin.controls['password'];
  }

}
