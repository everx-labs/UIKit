Example:

```js
class ModalExample extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            needBorderBottom: false,
            disabled: false,
            secureTextEntry: false,
            beginningTag: false,
        }
    }

    render() {
        const { 
            value, needBorderBottom, disabled, secureTextEntry, beginningTag
        } = this.state;
        return (
            <UIView>
                <UITextInput 
                    value={value}
                    placeholder="Your text"
                    beginningTag={beginningTag ? '@' : ''}
                    needBorderBottom={needBorderBottom}
                    disabled={disabled}
                    secureTextEntry={secureTextEntry}
                    containerStyle={{ marginBottom: 16 }}
                    onChangeText={(newText) => this.setState({ 
                        value: newText 
                    })}
                />
                <UIView style={{ 
                    flexDirection: 'row', justifyContent: 'space-between' 
                }}>
                    <UIDetailsToggle
                        details="Add bottom border"
                        active={needBorderBottom}
                        onPress={() => this.setState({ 
                            needBorderBottom: !needBorderBottom
                        })}
                    />
                    <UIDetailsToggle
                        details="Disable"
                        active={disabled}
                        onPress={() => this.setState({ 
                            disabled: !disabled
                        })}
                    />
                    <UIDetailsToggle
                        details="Secure text entry"
                        active={secureTextEntry}
                        onPress={() => this.setState({ 
                            secureTextEntry: !secureTextEntry
                        })}
                    />
                    <UIDetailsToggle
                        details="Add some begining tag"
                        active={beginningTag}
                        onPress={() => this.setState({ 
                            beginningTag: !beginningTag
                        })}
                    />
                </UIView>
            </UIView>
        );
    }
};
<ModalExample />
```