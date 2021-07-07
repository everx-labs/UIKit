You can change size of browser window to see different placements of UITooltip.

UITooltip show on hover for web and on long press for iOS and Android
Also for web there is a second type - onMouse tooltip.

```js
<div>
    <div style={{ 
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200
    }}>
        <UITooltip
            message="Message one"
        >
            <Text style={{ fontSize: 16 }}> Trigger 1</Text>
        </UITooltip>
        <UITooltip
            message="Message two with more text for two lines to see second option of layout."
        >
            <Text style={{ fontSize: 16 }}> Trigger 2</Text>
        </UITooltip>
        <UITooltip
            message="Message three is huge, with five lines of text wich contains more usefull information for all users and many-many bla-bla-bla to see maximum height of tooltip. You can add here some instructions."
        >
            <Text style={{ fontSize: 16 }}> Trigger 3</Text>
        </UITooltip>
    </div>
    <UILinkButton
        title="Show onMouse tooltip"
        onPress={() => UITooltip.showOnMouseForWeb('Message of onMouse tooltip')}
    />
    <UILinkButton
        title="Hide onMouse tooltip"
        onPress={() => UITooltip.hideOnMouseForWeb()}
    />
    <UILayoutManager />
 </div>
```
