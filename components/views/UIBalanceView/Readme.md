Example:

  ```js
 class ExampleComponent extends React.Component {
     constructor() {
         super();
         this.state = {
             balance: '100,000',
         }
     }

     render() {
         return (
             <View>
                 <UIBalanceView
                     testID="balanceView"
                     balance={this.state.balance}
                     separator=","
                     description="Total balance"
                     tokenSymbol="G"
                 />
             </View>
         );
     }
 };
 <ExampleComponent />
 ```
