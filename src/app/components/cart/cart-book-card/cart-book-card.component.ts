import { Component, OnInit, Input } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { User } from 'src/app/models/user.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-book-card',
  templateUrl: './cart-book-card.component.html',
  styleUrls: ['./cart-book-card.component.scss']
})
export class CartBookCardComponent implements OnInit {
  myCart: Book[] = this.localStorageService.user.cart;
  @Input() book!: Book;
  user: User = this.localStorageService.getUser();

  constructor(private bookService: BookService, private cartService: CartService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.myCart = this.localStorageService.user.cart;
  }

  ngDoCheck(): void {
    this.myCart = this.localStorageService.user.cart;
  }

  onOpenBookDetails(book:Book) {
    this.bookService.onOpenBookDetails(book);
  }

  removeFromCart(book:Book) {
    this.cartService.removeFromCart(book);
  }

  addQuantity(book: Book) {
    this.cartService.addQuantity(book)
  }

  reduceQuantity(book: Book) {
    this.cartService.reduceQuantity(book)
  }


}
