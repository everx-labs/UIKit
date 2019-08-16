Example:

```js
const iconCam = require('../../../assets/ico-camera/ico-camera.png');

class Example extends React.Component  {
    render() {
        return (
            <React.Fragment>
                <UIActionIcon
                    style={{ marginTop: 16 }}
                    buttonStyle={UIActionIcon.Style.Full}
                    buttonShape={UIActionIcon.Shape.Radius}
                />
                <UIActionIcon
                    style={{ marginTop: 16 }}
                    buttonStyle={UIActionIcon.Style.Border}
                    buttonShape={UIActionIcon.Shape.Radius}
                />
                <UIActionIcon
                    style={{ marginTop: 16 }}
                    buttonStyle={UIActionIcon.Style.Link}
                />

                <UIActionIcon
                    style={{ marginTop: 16 }}
                    buttonStyle={UIActionIcon.Style.Full}
                    buttonShape={UIActionIcon.Shape.Rounded}
                />
                <UIActionIcon
                    style={{ marginTop: 16 }}
                    buttonStyle={UIActionIcon.Style.Border}
                    buttonShape={UIActionIcon.Shape.Rounded}
                />
                <UIActionIcon
                    style={{ marginTop: 16 }}
                    buttonStyle={UIActionIcon.Style.Link}
                    icon={iconCam}
                />

            </React.Fragment>
        );
    }
};
<Example />
```
