import { $, browser, ExpectedConditions, $$ } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should undo added book to reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();
    const books = await $$('[data-testing="book-item"]');
    expect(books.length).toBeGreaterThan(0);


    const wantToReadBtn = books[0].$('[data-testing="read-btn"]').click();

    await browser.waitForAngularEnabled(false);
    await $('[data-testing="toggle-reading-list"]').click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    let readingItems = await $$('[data-testing="reading-list-item"]');
    expect(readingItems.length).toBe(1);
    const snackbar = await $$('.mat-simple-snackbar');
    expect(snackbar).toBeTruthy();

    await $('.mat-simple-snackbar-action .mat-button').click();
    readingItems = await $$('[data-testing="reading-list-item"]');
    expect(readingItems.length).toBe(0);

    await browser.waitForAngularEnabled(true);
  });

  it('Then: I should undo removed book from reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();
    const books = await $$('[data-testing="book-item"]');
    books[0].$('[data-testing="read-btn"]').click();
    await browser.waitForAngularEnabled(false);
    await $('[data-testing="toggle-reading-list"]').click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    let readingItems = await $$('[data-testing="reading-list-item"]');
    expect(readingItems.length).toBe(1);

    await readingItems[0].$('[data-testing="remove-btn"]').click();

    readingItems = await $$('[data-testing="reading-list-item"]');
    expect(readingItems.length).toBe(0);
    const snackbar = await $$('.mat-simple-snackbar');
    expect(snackbar).toBeTruthy();

    await $('.mat-simple-snackbar-action .mat-button').click();
    readingItems = await $$('[data-testing="reading-list-item"]');
    expect(readingItems.length).toBe(1);

    await browser.waitForAngularEnabled(true);
    const removeButton = readingItems[0].$('[data-testing="remove-btn"]');
    await removeButton.click();
    readingItems = await $$('[data-testing="reading-list-item"]');
    expect(readingItems.length).toBe(0);
  });
});
