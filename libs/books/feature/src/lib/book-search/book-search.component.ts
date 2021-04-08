import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { BOOK_CONSTANT } from '../book.constant';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  subscription$: Subscription;

  searchForm = this.fb.group({
    term: BOOK_CONSTANT.EMPTY_STRING
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit() {
    this.subscription$ = this.searchForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged((prev, next) => prev.term === next.term)
      ).subscribe(searchText =>{
        this.searchBooks();
      })
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue(BOOK_CONSTANT.DEFAULT_SEARCH_TERM);
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy() {
    if(this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
