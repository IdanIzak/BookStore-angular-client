import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';
import { BookService } from './book.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  myCart: Book[] = this.localStorageService.user.cart;
  totalPrice: BehaviorSubject<number> = new BehaviorSubject(0);
  isCheckoutSeccessful: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isCheckoutClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isInCart: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isCartEmpty: BehaviorSubject<boolean> = new BehaviorSubject(this.myCart.length===0);
  isBookAddedToCart: BehaviorSubject<boolean> = new BehaviorSubject(false);
  bookAddedId: BehaviorSubject<string> = new BehaviorSubject('');
  user: User = this.localStorageService.getUser();

  constructor(private bookService: BookService, private localStorageService: LocalStorageService, private authService: AuthService) { }

  addQuantity(book: Book) {
    this.totalPrice.next(this.totalPrice.value+book.price);
    book.inCartCount++;
    this.updateListsData(book);
    this.storeAllData();
  }

  onAddToCart(book:Book) {
    this.isInCart.next(false);
    for(let item of this.localStorageService.user.cart) {
      if(book.id === item.id) {
         this.isInCart.next(true);
         book.inCartCount = item.inCartCount;
         break;
        }
      }
      if(this.isInCart.value===false) {
        book.inCartCount = 0;
        this.localStorageService.user.cart.push(book);
      }
    book.inCartCount++;
    this.updateListsData(book);
    this.bookAddedId.next(book.id);
    this.isBookAddedToCart.next(true);
    this.storeAllData();
  }

  onCheckout(cart: Book[]) {
    this.isCheckoutClicked.next(true);
    if(!this.localStorageService.user.username) {
      this.isCheckoutSeccessful.next(false);
      this.isCartEmpty.next(false);
      return false;
    }
    this.localStorageService.user.cart.splice(0, cart.length)
    for(let item of this.bookService.bookList) {
      item.inCartCount = 0;
    }
    this.totalPrice.next(0);
    this.isCheckoutSeccessful.next(true);
    this.isCartEmpty.next(true);
    this.storeAllData();
    return true;
  }

  reduceQuantity(book:Book) {
    book.inCartCount--;
    this.updateListsData(book);
    this.totalPrice.next(this.totalPrice.value-book.price);
    this.storeAllData();
    if(this.localStorageService.user.cart.length===0)
    this.isCartEmpty.next(true);
  }

  removeFromCart(book:Book) {
    this.totalPrice.next(this.totalPrice.value - book.price * book.inCartCount);
    book.inCartCount = 0;
    this.updateListsData(book);
    if(this.localStorageService.user.cart.length===0)
      this.isCartEmpty.next(true);
      this.storeAllData();
  }

  updateListsData(book: Book) {
    for(let i=0; i<this.localStorageService.user.cart.length; i++) {
      if(this.localStorageService.user.cart[i].id === book.id) {
        this.localStorageService.user.cart[i].inCartCount = book.inCartCount;
        if(book.inCartCount === 0)
          this.localStorageService.user.cart.splice(i,1);
        break;
      }
    }
    for(let item of this.bookService.bookList) {
      if(item.id === book.id) {
        item.inCartCount = book.inCartCount;
        break;
      }
    }
  }

  storeAllData() {
    this.localStorageService.storeBookList(this.bookService.bookList);
    if(this.authService.isLoggedin)
      this.localStorageService.storeCart(this.localStorageService.user.cart);
    else
      this.localStorageService.storeGuestCart(this.localStorageService.user.cart);
    this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,
    this.localStorageService.user.email, this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
  }
}


