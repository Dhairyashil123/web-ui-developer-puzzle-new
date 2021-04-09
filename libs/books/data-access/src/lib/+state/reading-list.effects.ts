import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { API_ENDPOINTS, NOTIFICATION } from './book.constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>(`${API_ENDPOINTS.LIST}`).pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post(`${API_ENDPOINTS.LIST}`, book).pipe(
          map(() => {
            this.showSnackBar(true, book);
            return ReadingListActions.confirmedAddToReadingList({ book });
          }),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`${API_ENDPOINTS.LIST}/${item.bookId}`).pipe(
          map(() => {
            this.showSnackBar(false, item);
            return ReadingListActions.confirmedRemoveFromReadingList({ item });
          }),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  private showSnackBar(isAdded: boolean, data: ReadingListItem | Book ) {
    let action, message;
    if (isAdded) {
      message = NOTIFICATION.ADD_BOOK;
      const { id: bookId, ...book } = data as Book;
      action = ReadingListActions.removeFromReadingList({
        item: { bookId, ...book }
      });
    } else {
      message = NOTIFICATION.REMOVE_BOOK;
      const { bookId: id, ...item } = data as ReadingListItem;
      action = ReadingListActions.addToReadingList({
        book: { id, ...item }
      });
    }

    this.snackbar
      .open(message, NOTIFICATION.UNDO_ACTION, {
        duration: NOTIFICATION.TIMEOUT
      })
      .onAction()
      .subscribe(() => {
        this.store.dispatch(action);
      });
    }

  constructor(private actions$: Actions,
      private http: HttpClient,
      private readonly snackbar: MatSnackBar,
      private readonly store: Store) {}
}
