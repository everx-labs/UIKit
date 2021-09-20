Example:

```js
const iconDisabled = require('../../../assets/ico-arrow-right/arrow-right-primary-minus.png');
const iconEnabled = require('../../../assets/ico-arrow-right/arrow-right-primary-1.png');
const iconHovered = require('../../../assets/ico-arrow-right/arrow-right-white.png');

class Example extends BackgroundContainer {
    renderContent() {
        return (
            <View>
                <View style={UIStyle.paddingDefault}>
                    <View style={UIStyle.centerLeftContainer}>
                        <Text
                            style={[UIStyle.marginRightDefault, UITextStyle.actionMinusSmallMedium]}
                        >
                            Disabled:
                        </Text>
                        <UIActionImage
                            iconEnabled={iconEnabled}
                            iconDisabled={iconDisabled}
                            iconHovered={iconHovered}
                            disabled
                        />
                    </View>
                    <View style={[UIStyle.centerLeftContainer, UIStyle.marginTopDefault]}>
                        <Text
                            style={[UIStyle.marginRightDefault, UITextStyle.actionMinusSmallMedium]}
                        >
                            Enabled:
                        </Text>
                        <UIActionImage
                            iconEnabled={iconEnabled}
                            iconDisabled={iconDisabled}
                            iconHovered={iconHovered}
                            onPress={() => alert('Action was called!')}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
<Example />;
```
