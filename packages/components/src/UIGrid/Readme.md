Example:

```js

const styles = {
    grid: {
        backgroundColor: UIColor.whiteLight(),
        marginTop: 16
    },
};

class Example extends React.Component  {
    render() {
        return (
          <View>
            <UIGrid type={UIGrid.Type.C6}
                    style={styles.grid}>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={3}>
                <UIBoxButton title="3 cells" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.warning(), padding: 2}} medium={3}>
                <UIBoxButton title="3 cells" />
              </UIGridColumn>
            </UIGrid>

            <UIGrid type={UIGrid.Type.C8}
                    style={styles.grid}>
              <UIGridColumn style={{backgroundColor: UIColor.warning(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={2}>
                <UIBoxButton title="2 cells" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.warning(), padding: 2}} medium={4}>
                <UIBoxButton title="4 cells" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.warning(), padding: 2}} medium={3}>
                <UIBoxButton title="3 cells" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.warning(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
            </UIGrid>

            <UIGrid type={UIGrid.Type.C12}
                    style={styles.grid}
                    gutter={4}
                    rowGutter={8}
                    >
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={4}>
                <UIBoxButton title="4 cells" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={4}>
                <UIBoxButton title="4 cells" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={4}>
                <UIBoxButton title="4 cells" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
              <UIGridColumn style={{backgroundColor: UIColor.success(), padding: 2}} medium={1}>
                <UIBoxButton title="1 cell" />
              </UIGridColumn>
            </UIGrid>

          </UIGridColumn>
        );
    }
};
<Example />
```
