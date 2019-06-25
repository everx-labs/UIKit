Example:

  ```js
 const logo = require('../assets/logo.png');

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
                     testID="landingView"
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
