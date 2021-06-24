import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { FocusPageComponent } from './pages/focus-page/focus-page.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    FocusPageComponent,
    SignUpPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot({
      position: ['top', 'right'],
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
