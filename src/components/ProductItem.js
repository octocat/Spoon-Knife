import React, {Component} from 'react';
import { Container, Row, Col,Card, CardImg, CardText, CardBlock,CardDeck,CardTitle, CardSubtitle, Button } from 'reactstrap';
    
/**
 * @param {*} props 
 * The ProductItem Component  contains a single product with all properties
 */
const  ProductItem =(props)=>{

      // here we can access single product which was passed from the ProductList to ProductItem with the property product
     // we set price will show to false
       let isPriceToshow = false;
       var discount;
      // get old_price and newprice
       let old_price = parseFloat(props.product.price_old);
       let  new_price = parseFloat(props.product.price);
       // Show the discount only if there are higher than the new price, becouse on the price_old there are price 0,00 and same price
       // compare and show only where there is the actual discount price
        if(old_price > new_price& old_price != new_price){
          discount = old_price - new_price;
          isPriceToshow= true
        }
        // all the products are display in a card
              return(
                    <div>
                        <Card>
                                <CardImg id="cardImage" top width="100%" src={props.product.image} alt="Card image cap" />
                                <CardBlock>
                                    <CardSubtitle id="nameTag">{props.product.name}                                
                                    </CardSubtitle >
                                    <CardText className="priceTag" id ="priceTag_old">{isPriceToshow?props.product.price_old +props.product.currency:'' }
                                    </CardText>
                                    <p className="priceTag">{props.product.price}-{props.product.currency}</p> 
                                    <Button id ="cardDetail">Details
                                    </Button>      
                                 </CardBlock>
                        </Card>
                    </div>   
    );
}

export default ProductItem;