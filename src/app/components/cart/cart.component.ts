import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CartService } from 'src/app/services/cart.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  user: User = this.localStorageService.getUser();
  isMyCartEmptySub:Subscription = new Subscription();
  isMyCartEmpty?:boolean;
  myCart: Book[] = this.localStorageService.user.cart;
  totalPriceSub:Subscription = new Subscription();
  totalPrice: number = 0;
  isCheckoutSeccessfulSub:Subscription = new Subscription();
  isCheckoutSeccessful: boolean = false;
  isCheckoutClickedSub:Subscription = new Subscription();
  isCheckoutClicked: boolean = false;

  constructor(private cartService: CartService, private localStorageService: LocalStorageService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.myCart = this.localStorageService.user.cart;
    this.modalService.isModalHidden.next(true);

    this.totalPriceSub = this.cartService.totalPrice.subscribe({next:(val)=>{
      this.totalPrice = val
      }, error:(err)=>{
      console.log(err)
      }});

    this.isMyCartEmptySub = this.cartService.isCartEmpty.subscribe({next:(val)=>{
      this.isMyCartEmpty = val
      }, error:(err)=>{
      console.log(err)
      }});

    this.isCheckoutSeccessfulSub = this.cartService.isCheckoutSeccessful.subscribe({next:(val)=>{
      this.isCheckoutSeccessful = val
      }, error:(err)=>{
      console.log(err)
      }});
      this.cartService.isCheckoutSeccessful.next(false);

    this.isCheckoutClickedSub = this.cartService.isCheckoutClicked.subscribe({next:(val)=>{
      this.isCheckoutClicked = val
      }, error:(err)=>{
      console.log(err)
      }});
      this.cartService.isCheckoutClicked.next(false);

    this.cartService.isCartEmpty.next(this.localStorageService.user.cart.length === 0);

    for(let item of this.myCart) {
      this.cartService.totalPrice.next(this.cartService.totalPrice.value + item.inCartCount * item.price)
    }
  }

  ngDoCheck(): void {
    this.myCart = this.localStorageService.user.cart;
  }

  onCheckout(myCart: Book[]) {
    this.cartService.onCheckout(myCart);
  }

  ngOnDestroy(): void {
    this.isCheckoutClicked = false;
    this.cartService.totalPrice.next(0);
  }

}
