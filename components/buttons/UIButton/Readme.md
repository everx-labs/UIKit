Example:

```js
const iconCam = require('../../../assets/ico-camera/ico-camera.png');

class Example extends React.Component  {
    render() {
        return (
            <View style={{ maxWidth: 330 }}>
                <UIButton
                    title="Default button"
                    onPress={() => alert('Action was called')}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    buttonShape={UIButton.ButtonShape.Radius}
                    title="Radius button"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    buttonShape={UIButton.ButtonShape.Rounded}
                    title="Rounded button"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    buttonStyle={UIButton.ButtonStyle.Full}
                    title="Action"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    buttonStyle={UIButton.ButtonStyle.Full}
                    disabled
                    title="Disabled"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    buttonStyle={UIButton.ButtonStyle.Border}
                    title="Action"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    buttonStyle={UIButton.ButtonStyle.Border}
                    disabled
                    title="Disabled"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    buttonStyle={UIButton.ButtonStyle.Link}
                    title="Action"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    buttonStyle={UIButton.ButtonStyle.Link}
                    disabled
                    title="Disabled"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    hasIcon
                    title="Center & IconL"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    hasIcon
                    buttonStyle={UIButton.ButtonStyle.Border}
                    title="Center & IconL"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    hasIcon
                    buttonStyle={UIButton.ButtonStyle.Link}
                    title="Center & IconL"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    hasIconR
                    title="Center & IconR"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    hasIconR
                    buttonStyle={UIButton.ButtonStyle.Border}
                    title="Center & IconR"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    hasIconR
                    buttonStyle={UIButton.ButtonStyle.Link}
                    title="Center & IconR"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    hasIcon
                    hasIconR
                    title="Center & 2 ico"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    hasIcon
                    hasIconR
                    buttonStyle={UIButton.ButtonStyle.Border}
                    title="Center & 2 ico"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    hasIcon
                    hasIconR
                    buttonStyle={UIButton.ButtonStyle.Link}
                    title="Center & 2 ico"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIcon
                    title="Left & IconL"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIcon
                    buttonStyle={UIButton.ButtonStyle.Border}
                    title="Left & IconL"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIcon
                    buttonStyle={UIButton.ButtonStyle.Link}
                    title="Left & IconL"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIconR
                    title="Left & IconR"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIconR
                    buttonStyle={UIButton.ButtonStyle.Border}
                    title="Left & IconR"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIconR
                    buttonStyle={UIButton.ButtonStyle.Link}
                    title="Left & IconR"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIcon
                    hasIconR
                    title="Left & 2 ico"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIcon
                    hasIconR
                    buttonStyle={UIButton.ButtonStyle.Border}
                    title="Left & 2 ico"
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    hasIcon
                    hasIconR
                    buttonStyle={UIButton.ButtonStyle.Link}
                    title="Left & 2 ico"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    icon={iconCam}
                    iconR={iconCam}
                    buttonStyle={UIButton.ButtonStyle.Border}
                    title="Left & 2 ico"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Left}
                    icon={iconCam}
                    buttonStyle={UIButton.ButtonStyle.Border}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    textAlign={UIButton.TextAlign.Right}
                    icon={iconCam}
                    buttonStyle={UIButton.ButtonStyle.Border}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    icon={iconCam}
                />

                <UIButton
                    badge={10}
                    style={{ marginTop: 16 }}
                    buttonStyle={UIButton.ButtonStyle.Full}
                    title="Badged"
                />

                <UIButton
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UIButton.Indicator.Spin}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UIButton.Indicator.Spin}
                    buttonStyle={UIButton.ButtonStyle.Border}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UIButton.Indicator.Spin}
                    buttonStyle={UIButton.ButtonStyle.Link}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UIButton.Indicator.Round}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UIButton.Indicator.Pulse}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    showIndicator
                    indicatorAnimation={UIButton.Indicator.Sandglass}
                />
                <UIButton
                    style={{ marginTop: 16 }}
                    showIndicator
                    buttonStyle={UIButton.ButtonStyle.Border}
                />
            </View>
        );
    }
};
<Example />
```
