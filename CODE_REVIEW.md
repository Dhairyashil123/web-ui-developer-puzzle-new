Are there any problems or code smells in the app?
    1. Remove subscription from ts and use async pipe in html file so we can avoid memory leaks.
    2. Instead of using hard coded value we can use constant so it will easy to handle when in future any changes required in value of those variables.
    3. Instead of calling date method from template we can use date pipe. This will increase application performance by decreasing dirty check cycles.

Are there other improvements you would make to the app? What are they and why?
    1. We can remove OnInit interface from total count component as there is no method body inside ngOnInit method.
    2. Loader is missing in application. We can show it when fetching data from APIs.
    3. Currently all data is fetched in single call, there is not pegination implemented. We can implement pagination when record count is high so it will not take much time to load application.

Manual accessibility - 
    1. alt attribute is not added for image, that will helpful when image in not redered on view.
    2. Inside book list component book details like book, publisher, publishedDate, title fields are not accessibile. To fix this issue added tabIndex and aria-label attribute so it will read book related details.

Lighthouse accessibility issue - 
    After running Lighthouse in chrome it is showing "Buttons do not have an accessible name". Fixed this issue by adding aria-label attribute.
    Fix below issue by increasing font-weight.
    "Background and foreground colors do not have a sufficient contrast ratio"