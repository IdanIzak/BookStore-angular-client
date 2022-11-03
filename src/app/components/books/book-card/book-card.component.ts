import { Component, OnInit, Input } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {
  bookList: Book[] = [];
  @Input() book!: Book;
  user: User = this.localStorageService.getUser();
  isBookAddedToCartSub:Subscription = new Subscription();
  isBookAddedToCart?:boolean;
  bookAddedIdSub:Subscription = new Subscription();
  bookAddedId?:string;

  constructor(private bookService: BookService, private cartService: CartService, private modalService: ModalService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.bookList =  this.bookService.bookList;

    this.isBookAddedToCartSub = this.cartService.isBookAddedToCart.subscribe({next:(val)=>{
      this.isBookAddedToCart = val
      }, error:(err)=>{
      console.log(err)
      }});
      setTimeout(() => {
        this.cartService.isBookAddedToCart.next(false);
      }, 10000);

    this.bookAddedIdSub = this.cartService.bookAddedId.subscribe({next:(val)=>{
      this.bookAddedId = val
      }, error:(err)=>{
      console.log(err)
      }});
      setTimeout(() => {
        this.cartService.bookAddedId.next('');
      }, 10000);
  }

  ngDoCheck(): void {
    this.bookList = this.bookService.bookList;
  }

  onOpenBookDetails(book:Book) {
    this.bookService.onOpenBookDetails(book);
  }

  onAddToCart(book:Book) {
    this.cartService.onAddToCart(book);
  }

  onOpenModal(book: Book) {
    this.modalService.onOpenModal(book);
  }

  deleteBook(book: Book) {
    this.bookService.deleteBook(book);
  }

}
