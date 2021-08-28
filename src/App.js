import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  NavBar from './components/NavBar';
import  ProductList from './components/ProductList';
import  ProductItem from './components/ProductItem';
import { Container, Row, Col,Card, CardImg, CardText, CardBlock,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import axios from 'axios';


/**
 * In Real worl apllication we will structure the application to separe the component that power
 *  data to the application  and the
 * component that power the view.
 * In this scenario Redux will be the complete solution to power the data(backend) and
 *  the React wil be the component to  power the Views (Frontend) 
 * For the scope  of this application as a sample I decided to use only the React to do the job.
 * React is stuctured as a tree where parent communicates to the chidren with the top down approach.
 * The main component (App) is responsible for the the data layer( sending request and response , sorting the response is the parent) 
 * while the data process can then be passed to the children.
 * This approach make it more modular.
 */


/**
 * The App component is the parent, NavBar,ProductList,ProductItem are the children
 * The App handles all the request and response  from the extern Api.
 * Parent(App), (NavBar & ProductList are sibling first childreen) (productItem single product in a list of produts(ProductList))
 *
 */

    class App extends Component {
          constructor(props) {
              super(props);
              this.state = {
              productlist: []
              };
          }
          /**
           *  We make the Apical using a third part library Axios
           */
      componentDidMount() {
        axios.get('https://www.unisport.dk/api/sample')
          .then(res => {
            const productlist= res.data.products.map(obj => obj);
            // the response is set to productList
            this.setState({ productlist });
          });
      }
    render(){

          // The response is retreived as an array from state
        let product = this.state.productlist;
        
        /**In order to sort the product we use array sort method.
          * Sorting the product price in DSC order
          */
        const products = product.sort((a, b) => (
        parseFloat( b.price) > parseFloat(a.price)? -1 : 1
          ));
          /**
           * Here are two childreen components, the productlist as childreen 
             productItem the data are passed here as properties
            to the NavBar logo and to the ProductList product
          */
          let logo="ReactApi";
        return(
          <div className="App">
            <NavBar logo={logo}/>
            <ProductList products ={products} />
          </div>
        )
    }
    }

    export default App;
