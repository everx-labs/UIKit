Example:

```js
const detailsList = [
    {
        caption: 'row 1',
        value: 'value 1',
    },
    {
        caption: 'row 2',
        value: 'value 2',
        type: UIDetailsTable.CellType.Success,
    },
    {
        caption: 'row 3',
        value: 'value 3',
        type: UIDetailsTable.CellType.Action,
    },
    {
        caption: 'row 4',
        value: 'value 4',
        type: UIDetailsTable.CellType.Accent,
    },
    {
        caption: 'row 5',
        value: '7,900,404 (98.8 %)',
        type: UIDetailsTable.CellType.NumberPercent,
    },
    {
        caption: 'row 6',
        value: '100.00000000',
        type: UIDetailsTable.CellType.Gram,
    },
];

<UIDetailsTable detailsList={detailsList} />;
```
