import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User = this.localStorageService.user;
  loggedinSub:Subscription = new Subscription();
  isLoggedIn:boolean = false;
  bookList: any[] = this.bookService.bookList;
  searchInputSub:Subscription = new Subscription();
  searchInput: string = '';
  searchUrl: string = '';

  constructor(private bookService: BookService, private localStorageService: LocalStorageService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.searchUrl = this.route.snapshot.params['searchInput'];
   }

  ngOnInit(): void {
    this.loggedinSub = this.authService.isLoggedin.subscribe({next:(val)=>{
      this.isLoggedIn = val
      }, error:(err)=>{
      console.log(err)
      }});

    this.searchInputSub = this.bookService.searchInput.subscribe({next:(val)=>{
      if(val !== '')
        this.searchInput = val
      else
        this.searchInput = this.searchUrl;
      }, error:(err)=>{
      console.log(err)
      }});
      this.bookService.searchInput.next(this.searchInput);

  }

  isUserLoggedIn() {
    return this.isLoggedIn;
  }

  logout() {
    this.localStorageService.storeBookList(this.bookService.bookList);
    this.authService.logout();
  }

  showResults(title: string) {
   this.searchInput = title;
    this.router.navigate(['/search'], { queryParams: { searchText: this.searchInput },relativeTo: this.route, skipLocationChange: true}
    );
  }

  ngOnDestroy(): void {
    if(this.loggedinSub) this.loggedinSub.unsubscribe();
    if(this.searchInputSub) this.searchInputSub.unsubscribe();
  }
}
