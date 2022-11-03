import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorsService } from 'src/app/services/validators.service';
import { UUID } from 'angular2-uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  signupForm!: FormGroup;
  id:string = UUID.UUID();
  isSignupUrl?:boolean;
  isProfileUrl?:boolean;
  isLoginUrl?:boolean;
  user: User = this.localStorageService.getUser();
  loginFialedSub:Subscription = new Subscription();
  loginFailed: boolean = false;

  constructor(private fb: FormBuilder, private validatorsService: ValidatorsService, private route: ActivatedRoute, private authService: AuthService, private router: Router, private localStorageService: LocalStorageService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.route.url.subscribe((()=> {
      this.isSignupUrl = this.router.url.includes('signup');
      this.isLoginUrl = this.router.url.includes('login');
      this.isProfileUrl = (this.router.url.includes('profile') || this.router.url.includes('admin'));
    }));

    this.signupForm = this.fb.group({
      username: ['', [this.validatorsService.required]],
      password: ['', [this.validatorsService.required, this.validatorsService.pattern(this.authService.pwPattern)]],
      repeatPassword: [''],
      email: [''],
      name: ['']
    });

    if(!this.isLoginUrl) {
     this.signupForm.get('repeatPassword')?.addValidators([this.validatorsService.required, this.validatorsService.pattern(this.authService.pwPattern)]);
     this.signupForm.get('email')?.addValidators([this.validatorsService.required, this.validatorsService.email]);
     this.signupForm.get('name')?.addValidators([this.validatorsService.required]);
    }

    this.loginFialedSub = this.authService.loginFailed.subscribe({next:(val)=>{
      this.loginFailed = val
      }, error:(err)=>{
      console.log(err)
    }});
  }

  onSubmitSignup() {
   this.authService.signup(this.id, this.signupForm.get('username')?.value, this.signupForm.get('name')?.value,
   this.signupForm.get('email')?.value, this.signupForm.get('password')?.value, false);
  }

  onSubmitLogin() {
    this.authService.onSubmitLogin(this.signupForm.get('username')?.value, this.signupForm.get('password')?.value);
   }

  passwordMismatchMessage() {
    return this.validatorsService.passwordMismatchMessage(this.signupForm);
  }

  invalidUsernameMessage() {
    return this.validatorsService.invalidUsernameMessage(this.signupForm);
  }

  invalidPasswordMessage() {
    return this.validatorsService.invalidPasswordMessage(this.signupForm);
  }

  invalidEmailMessage() {
    return this.validatorsService.invalidEmailMessage(this.signupForm);
  }

  invalidNameMessage() {
    return this.validatorsService.invalidNameMessage(this.signupForm);
  }

  onEditProfile(signupForm: FormGroup) {
    this.authService.onEditProfile(signupForm);
  }

  exitModal() {
    this.modalService.exitModal();
  }

}
