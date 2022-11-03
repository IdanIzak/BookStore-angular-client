import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { BookService } from './book.service';
import { LocalStorageService } from './local-storage.service';
import { ModalService } from './modal.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginFailed = new BehaviorSubject<boolean>(false);
  user: User = this.localStorageService.getUser();
  private _isLoggedin = new BehaviorSubject<boolean>(false);
  isLoggedin:Observable<boolean> = this._isLoggedin.asObservable();
  isProfileEdited = new BehaviorSubject<boolean>(false);
  pwPattern: string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$';
  adminSecretPassword: string = 'Admin11!';
  adminLoginUrl = this.router.url.includes('admin/login');
  userDeleted: boolean = false;

  constructor(private localStorageService: LocalStorageService, private router: Router, private bookService: BookService, private modalService: ModalService) { }

  signup(id: string, username:string, name: string, email: string, password:string, isAdmin: boolean) {
    if(this.adminLoginUrl && password === this.adminSecretPassword)
      isAdmin = true;
    this.localStorageService.user = new User(id, username, name, email, password, [], isAdmin)
    this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,this.localStorageService.user.email,this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    this.router.navigate(['/login']);
  }

  onSubmitLogin(username:string, password:string) {
    this.localStorageService.storeGuestCart(this.localStorageService.user.cart);
    this.localStorageService.user.username = 'guest';
    this.localStorageService.storeUser('guest', this.localStorageService.user.username, this.localStorageService.user.name,
      this.localStorageService.user.email, this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    let guest = this.localStorageService.getUser();

    this.localStorageService.user.username = username;
    this.user = this.localStorageService.getUser();
    if(!this.user) {
      this.localStorageService.user = {id: '', username: '', name: '', email: '', password: '', cart: [], isAdmin: false};
      this.loginFailed.next(true);
      return;
    }

    if(this.user.cart.length === 0)
      this.localStorageService.user.cart = guest.cart
    else
      this.localStorageService.user.cart  = this.user.cart;
    if(this.user.username === username && this.user.password == password) {
        this.localStorageService.user.password = password;
        this.login(this.user);
    }
    else {
      this._isLoggedin.next(false);
      this.loginFailed.next(true);
    }
  }

  login(user:any) {
    this.localStorageService.user.id = this.user.id;
    this.localStorageService.user.name = this.user.name;
    this.localStorageService.user.email = this.user.email;
    this.localStorageService.user.isAdmin = this.user.isAdmin;
    this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,
      this.localStorageService.user.email, this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    this._isLoggedin.next(true)
    this.loginFailed.next(false);
    if(user.isAdmin)
      this.router.navigate(['/admin']);
    else
      this.router.navigate(['/home']);
      console.log(user.cart)
  }

  onEditProfile(form: FormGroup) {
    const id = this.localStorageService.user.id;
    const cart = this.localStorageService.user.cart;
    localStorage.removeItem(this.localStorageService.user.username);
    this.localStorageService.user.username = form.get('username')?.value;
    this.localStorageService.user.password = form.get('password')?.value;
    this.localStorageService.user.email = form.get('email')?.value;
    this.localStorageService.user.name = form.get('name')?.value;
    this.localStorageService.user.isAdmin = this.localStorageService.user.password === this.adminSecretPassword;
    this.isProfileEdited.next(true);
    this.localStorageService.storeUser(id, this.localStorageService.user.username, this.localStorageService.user.name,
      this.localStorageService.user.email, this.localStorageService.user.password, cart, this.localStorageService.user.isAdmin);
    this.localStorageService.user = this.localStorageService.getUser();
    this.modalService.exitModal();
  }

  deleteUser() {
    this.userDeleted = true;
    localStorage.removeItem(this.localStorageService.user.username);
    this.logout();
  }

  logout() {
    if(!this.userDeleted) {
      this.localStorageService.storeCart(this.localStorageService.user.cart);
      this.localStorageService.storeBookList(this.bookService.bookList);
      this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,this.localStorageService.user.email,this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    }
    this._isLoggedin.next(false);
    this.localStorageService.user.username = '';
    this.localStorageService.user.cart = this.localStorageService.getGuestCart();
    this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,this.localStorageService.user.email,this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    this.router.navigate(['/login']);
  }
}
