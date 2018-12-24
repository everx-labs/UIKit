Example:

```js
const pages = {
    Tab1: {
        title: 'Left',
        screen: () => (<UIDetailsView value="Some left content"/>),
    },
    Tab2: {
        title: 'Center',
        screen: () => (<UIDetailsView value="Some center content"/>),
    },
    Tab3: {
        title: 'Right',
        screen: () => (<UIDetailsView value="Some right content"/>),
    },
};

<UITabView tabWidth={105} pages={pages} />;
```