Example:

  ```js
 const logo = require('../../../assets/logo/tonlabs/tonlabs-black.png');

 class ExampleComponent extends React.Component {
     constructor() {
         super();
         this.state = {
             title: 'Hello',
             description: 'World',
         }
     }

     render() {
         return (
             <View>
                 <UILandingView
                     icon={logo}
                     title={this.state.title}
                     description={this.state.description}
                 />
             </View>
         );
     }
 };
 
 <ExampleComponent />
 ```
