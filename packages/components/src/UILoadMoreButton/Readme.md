Example:

```js
class Example extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoadingMore: false,
        };
    }

    loadMore() {
        this.setState({ isLoadingMore: true });
        setTimeout(() => {
            this.setState({ isLoadingMore: false });
        }, 2000);
    }

    render() {
        const { isLoadingMore } = this.state;
        return (
            <UILoadMoreButton
                label="Push to load more"
                isLoadingMore={isLoadingMore}
                onLoadMore={() => this.loadMore()}
            />
        );
    }
}
<Example />;
```
