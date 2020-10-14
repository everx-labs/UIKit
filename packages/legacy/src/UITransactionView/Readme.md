Example:

 ```js
 class ExampleComponent extends React.Component {
     constructor() {
         super();
         this.state = {
             amount: '100,000',
         }
     }

     render() {
         return (
             <View>
                <UITransactionView
                    cacheKey="amountTransaction"
                    testID="transactionCellView"
                    amount={this.state.amount}
                    title="Jose Aguilar"
                    description="Sender"
                    separator=","
                    initials="JA"
                    // icon={icon} // If there is an icon, it will be rendered instead of the initials
                    onPress={this.onPressed}
                />
             </View>
         );
     }
 };

 <ExampleComponent />
 ```

