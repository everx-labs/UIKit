ID used for set a sertain color of component. It may be any string or number.
Now there are 14 colors for this in UIColor.

Example:

```js
const rowStyle = { 
    flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap',
};

renderProfile = (id, initials) => (
    <UIProfileInitials
		containerStyle={[
		    UIStyle.Margin.bottomDefault(), 
		    UIStyle.Margin.rightDefault(),
		]}
		id={id}
		initials={initials}
	/>
)

const Example = () => (
    <React.Fragment>
        <View style={rowStyle}>
            {renderProfile('1', 'A')}
            {renderProfile('2', 'B')}
            {renderProfile('3', 'C')}
            {renderProfile('4', 'D')}
            {renderProfile('5', 'E')}
            {renderProfile('6', 'F')}
            {renderProfile('7', 'G')}
        </View>
        
        <View style={rowStyle}>
        	{renderProfile('8', 'HI')}
			{renderProfile('9', 'JK')}
			{renderProfile('a', 'LM')}
			{renderProfile('b', 'NO')}
			{renderProfile('c', 'PQ')}
			{renderProfile('d', 'RS')}
			{renderProfile('e', 'TU')}
        </View>
    </React.Fragment>
);

<Example />
```
