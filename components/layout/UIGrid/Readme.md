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
              <View style={{backgroundColor: UIColor.success()}} medium={3}>
                <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.warning()}} medium={3}>
                <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
            </UIGrid>

            <UIGrid type={UIGrid.Type.C8}
                    style={styles.grid}>
              <View style={{backgroundColor: UIColor.warning()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={2}>
                <UIButton title="2 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.warning()}} medium={4}>
                <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.warning()}} medium={3}>
                <UIButton title="3 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.warning()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
            </UIGrid>

            <UIGrid type={UIGrid.Type.C12}
                    style={styles.grid}
                    gutter={4}
                    rowGutter={8}
                    >
              <View style={{backgroundColor: UIColor.success()}} medium={4}>
                <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={4}>
                <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={4}>
                <UIButton title="4 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
              <View style={{backgroundColor: UIColor.success()}} medium={1}>
                <UIButton title="1 cells" buttonStyle={UIButton.ButtonStyle.Border}/>
              </View>
            </UIGrid>

          </View>
        );
    }
};
<Example />
```
