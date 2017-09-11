import React, {Component} from 'react';
import  ProductItem from './ProductItem';
import { Container, Row, Col,Card, CardImg, CardText, CardBlock,
        CardTitle, CardSubtitle, Button } from 'reactstrap';
    /**
     * 
     * @param {*} props 
     * The Product copmponent is a fucntion component, is the child of the main App
     * It serves to list all products 
     */
const ProductList = (props) => {
    // listProduct is the a single item after iterating through the array product using map function .
    // this product was passed as a prop and is avalable through out this component
        const listProduct = props.products.map((product )=>{

        return  (
    // this is a single item in a row of 3 col
    /** here we are passing the product item to the ProductItem component as property and it will
     be available inside the ProductItem 
    */
            <Col sm ="4">
                 <ProductItem key={product} product={product}/>
            </Col>
        );
        
    });
         return(
    // Here all thr product is disolayed in the child component in a Container
             <Container>
                <Row>       
                    {listProduct}
                </Row>
             </Container>
              
            
            );
};
            
export default ProductList;