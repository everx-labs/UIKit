Example:

  ```js
 class Example extends React.Component {
     constructor() {
         super();
         this.state = {
             balance: '0',
             maxFractionalDigits: '2',
             loading: false,
         }
     }

     render() {
         return (
             <React.Fragment>
                 <View style={UIStyle.container.centerLeft()}>
                     <UIBoxButton
                         title="1426.53"
                         style={UIStyle.margin.rightDefault()}
                         onPress={() => this.setState({ balance: '1426.53', loading: false })}
                     />
                     <UIBoxButton
                         title="18.904638302"
                         style={UIStyle.margin.rightDefault()}
                         onPress={() => this.setState({ balance: '18.904638302', loading: false })}
                     />
                     <UIBoxButton
                         title="182"
                         style={UIStyle.margin.rightDefault()}
                         onPress={() => this.setState({ balance: '182', loading: false })}
                     />
                     <UIBoxButton
                         title="0"
                         style={UIStyle.margin.rightDefault()}
                         onPress={() => this.setState({ balance: '0', loading: false })}
                     />
                     <UIBoxButton
                         title="Random"
                         style={UIStyle.margin.rightDefault()}
                         onPress={() => {
                            const balance = Math.floor(Math.random() * 1000) / 100;
                            this.setState({ balance, loading: false })
                         }}
                     />
                     <UIBoxButton
                         title={this.state.loading ? 'Loading ....' : 'Set loading'}
                         style={UIStyle.margin.rightDefault()}
                         onPress={() => this.setState({ loading: true })}
                     />
                     <UIDetailsInput 
                        value={this.state.maxFractionalDigits}
                        placeholder="Max fractional digits"
                        onChangeText={(newValue) => {
                            if (!isNaN(newValue * 1)) {
                                this.setState({ maxFractionalDigits: newValue })
                            }
                        }}
                     />
                 </View>
                 <UIBalanceView
                      animated
                      loading={this.state.loading}
                      maxFractionalDigits={this.state.maxFractionalDigits * 1}
                      containerStyle={UIStyle.margin.topDefault()}
                      cacheKey="totalBalance"
                      testID="balanceView"
                      description="Total balance"
                      separator="."
                      tokenSymbol="Ġ"
                      balance={this.state.balance}
                 />
             </React.Fragment>
         );
     }
 };

 <Example />
 ```
