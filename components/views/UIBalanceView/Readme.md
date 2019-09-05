Example:

  ```js
 class ExampleComponent extends React.Component {
     constructor() {
         super();
         this.state = {
             balance: '0',
             loading: false,
         }
     }

     render() {
         return (
             <React.Fragment>
                 <View style={UIStyle.Common.centerLeftContainer()}>
                     <UIButton
                         title="3112345698"
                         style={UIStyle.Margin.rightDefault()}
                         onPress={() => this.setStateSafely({ testBalance: '3112345698', loading: false })}
                     />
                     <UIButton
                         title="182"
                         style={UIStyle.Margin.rightDefault()}
                         onPress={() => this.setStateSafely({ testBalance: '182', loading: false })}
                     />
                     <UIButton
                         title="18.9046383027"
                         style={UIStyle.Margin.rightDefault()}
                         onPress={() => this.setStateSafely({
                             testBalance: '18,9046383027', loading: false,
                         })}
                     />
                     <UIButton
                         title="0"
                         style={UIStyle.Margin.rightDefault()}
                         onPress={() => this.setStateSafely({ testBalance: '0', loading: false })}
                     />
                     <UIButton
                         title="Loading"
                         style={UIStyle.Margin.rightDefault()}
                         onPress={() => this.setStateSafely({ loading: true })}
                     />
                 </View>
                 <UIBalanceView
                      cacheKey="totalBalance"
                      testID="balanceView"
                      description="Total balance"
                      containerStyle={UIStyle.Common.flex()}
                      balance={this.state.balance}
                      separator=","
                      tokenSymbol="G"
                      loading={this.state.loading}
                 />
             </React.Fragment>
         );
     }
 };

 <ExampleComponent />
 ```
