import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';

const KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storage.read();
  }

  async addBook(b: Book): Promise<void> {
    this.storage.update(list => {
      const { id, ...rest } = b;
      list.push({
        bookId: id,
        ...rest
      });
      return list;
    });
  }

  async removeBook(id: string): Promise<void> {
    this.storage.update(list => {
      return list.filter(x => x.bookId !== id);
    });
  }

  async finishFromReadingList(item): Promise<ReadingListItem> {
    let book;
    this.storage.update(list => {
      book = list.find(readingItem => readingItem.bookId === item.bookId);
      if (book) {
        book.finished = true;
        book.finishedDate = new Date().toISOString();
      }
      return list;
    });
    return book;
  }
}
