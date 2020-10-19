Example:

```js

class Example extends React.Component  {
    render() {
        return (
            <React.Fragment>
            <View style={{maxWidth: 330}}>
                <UIButtonGroup>
                    <UIButton title="Action" style={{flex:1}} />
                    <UIButton title="Action" style={{flex:1}}  buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Accent Action" style={{flex:2}} />
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Loooooooong Action" style={{flex:3}} />
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup direction={UIButtonGroup.Direction.Column} style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Loooooooong Action" style={{flex:1}} />
                    <UIButton title="Loooooooong Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Action" style={{flex:1}} />
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Accent Action" style={{flex:2}}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Action" style={{flex:2}}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIActionIcon style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Accent Action" style={{flex:2}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Loooooooong Action" style={{flex:3}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup direction={UIButtonGroup.Direction.Column} style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Loooooooong Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Loooooooong Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Accent Action" style={{flex:2}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Action" style={{flex:2}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIButton title="Action" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                    <UIActionIcon style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Link}/>
                </UIButtonGroup>

                <UIButtonGroup style={UIStyle.Margin.topDefault()}>
                    <UIButton title="Back" style={{flex:1}} buttonStyle={UIButton.ButtonStyle.Border}/>
                    <UIButton title="Accent Action" style={{flex:2}} />
                </UIButtonGroup>
              </View>
            </React.Fragment>
        );
    }
};
<Example />
```
