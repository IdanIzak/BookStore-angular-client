import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { ValidatorsService } from 'src/app/services/validators.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit, DoCheck {
  editForm!: FormGroup;
  user?: User = this.localStorageService.getUser();
  bookToEdit = this.modalService.bookToEdit;
  isModalHiddenSub:Subscription = new Subscription();
  isModalHidden: boolean = true;
  isEditingBookSub:Subscription = new Subscription();
  isAddingBookSub:Subscription = new Subscription();
  isEditingBook: boolean = false;
  isAddingBook: boolean = false;

  constructor(private fb: FormBuilder, private validatorsService: ValidatorsService, private bookService: BookService, private localStorageService: LocalStorageService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      title: ['', [this.validatorsService.required]],
      image: ['', [this.validatorsService.required]],
      author: ['', [this.validatorsService.required]],
      description: ['', [this.validatorsService.required]],
      price: [0, [this.validatorsService.required]],
    });

    this.isModalHiddenSub = this.modalService.isModalHidden.subscribe({next:(val)=>{
      this.isModalHidden = val
      }, error:(err)=>{
      console.log(err)
    }});
    this.modalService.isModalHidden.next(true);

    this.isEditingBookSub = this.modalService.isEditingBook.subscribe({next:(val)=>{
      this.isEditingBook = val
      }, error:(err)=>{
      console.log(err)
    }});

    this.isAddingBookSub = this.modalService.isAddingBook.subscribe({next:(val)=>{
      this.isAddingBook = val
      }, error:(err)=>{
      console.log(err)
    }});
  }

  ngDoCheck(): void {
     this.bookToEdit = this.modalService.bookToEdit;
  }

  invalidTitleMessage() {
    return this.validatorsService.invalidTitleMessage(this.editForm);
  }

  invalidImageMessage() {
    return this.validatorsService.invalidImageMessage(this.editForm);
  }

  invalidAuthorMessage() {
     return this.validatorsService.invalidAuthorMessage(this.editForm);
   }

   invalidDescriptionMessage() {
     return this.validatorsService.invalidDescriptionMessage(this.editForm);
   }

   invalidPriceMessage() {
     return this.validatorsService.invalidPriceMessage(this.editForm);
   }

  onEditBook(editForm: FormGroup) {
    this.bookService.onEditBook(editForm);
  }

  onAddBook(editForm: FormGroup) {
    this.bookService.onAddBook(editForm);
  }

  exitModal() {
    this.modalService.exitModal();
  }
}
