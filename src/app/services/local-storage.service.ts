import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  user: User = {id: '', username: '', name: '', email: '', password: '', cart: [], isAdmin: false};

  constructor() { }

  storeCart(myCart: Book[]) {
    localStorage.setItem('cart', JSON.stringify(myCart));
  }

  getCart() {
    this.user.cart = (JSON.parse(''+localStorage.getItem('cart'))) || '[]';
    return this.user.cart;
  }

  storeGuestCart(myCart: Book[]) {
    localStorage.setItem('guestCart', JSON.stringify({myCart}.myCart));
  }

  getGuestCart() {
    this.user.cart = (JSON.parse(''+localStorage.getItem('guestCart'))) || '[]';
    return this.user.cart;
  }

  storeUser(id: string, username: string, name: string, email: string, password: string, cart: Book[], isAdmin: boolean) {
    localStorage.setItem(this.user.username, JSON.stringify({id: id, username: username, name: name, email: email, password: password, cart: cart, isAdmin: isAdmin}));
  }

  getUser() {
    this.user =JSON.parse(''+localStorage.getItem(this.user.username));
    return this.user;

  }

  storeBookList(bookList: Book[]) {
    localStorage.setItem('bookList', JSON.stringify({bookList}.bookList));
  }

  getBookList() {
    return (JSON.parse(''+localStorage.getItem('bookList'))) || '[]';
  }
}
