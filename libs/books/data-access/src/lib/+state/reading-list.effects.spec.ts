import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { API_ENDPOINTS } from './book.constant';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(API_ENDPOINTS.LIST).flush([]);
    });

    describe('finishFromReadingList$', () => {
      it('should trigger action confirmedFinished if finish api return success', (done) => {
        actions = new ReplaySubject();
        const testItem = createReadingListItem('A');
        actions.next(ReadingListActions.finishFromReadingList({ item: testItem }));
        const updatedTestItem = {
          ...testItem,
          finished: true,
          finishedDate: '2021-30-03T00:00:00.000Z'
        };
        effects.markBookAsFinished$.subscribe((action) => {
          expect(action).toEqual(
            ReadingListActions.confirmedFinished({
              item: updatedTestItem
            })
          );
          done();
        });
        httpMock.expectOne(`${API_ENDPOINTS.LIST}/A/finished`).flush({ ...updatedTestItem });
      });
  
      it('should trigger action failedFinished if finish api return error', (done) => {
        actions = new ReplaySubject();
        const testItem = createReadingListItem('A');
        actions.next(ReadingListActions.finishFromReadingList({ item: testItem }));
        effects.markBookAsFinished$.subscribe((action) => {
          expect(action).toEqual(
            ReadingListActions.failedFinished({
              error: 'error occured from backend'
            })
          );
          done();
        });
        httpMock
          .expectOne(`${API_ENDPOINTS.LIST}/A/finished`)
          .error(new ErrorEvent('HttpErrorResponse'), {
            status: 500,
            statusText: 'error occured from backend'
          });
      });
    });
  });
});
