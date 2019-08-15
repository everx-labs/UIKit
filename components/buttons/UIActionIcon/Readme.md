Example:

```js
const iconCam = require('../../../assets/ico-camera/ico-camera.png');

class Example extends React.Component  {
    render() {
        return (
            <React.Fragment>
                <UIActionIcon
                    buttonStyle={UIActionIcon.Style.Full}
                />
                <UIActionIcon
                    style={UIStyle.Margin.topDefault()}
                    buttonStyle={UIActionIcon.Style.Border}
                />
                <UIActionIcon
                    style={UIStyle.Margin.topDefault()}
                    buttonStyle={UIActionIcon.Style.Link}
                />

                <UIActionIcon
                    style={UIStyle.Margin.topDefault()}
                    buttonStyle={UIActionIcon.Style.Full}
                    buttonShape={UIActionIcon.Shape.Rounded}
                />
                <UIActionIcon
                    style={UIStyle.Margin.topDefault()}
                    buttonStyle={UIActionIcon.Style.Border}
                    buttonShape={UIActionIcon.Shape.Rounded}
                />
                <UIActionIcon
                    style={UIStyle.Margin.topDefault()}
                    buttonStyle={UIActionIcon.Style.Link}
                    icon={iconCam}
                />

            </React.Fragment>
        );
    }
};
<Example />
```
