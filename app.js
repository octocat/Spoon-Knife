var app = angular.module("myApp",[]);
app.controller("myController",myMethod);

function myMethod(){
  this.displayOperator = function(button){
    this.selectedOperator = button;
  }
  
  this.calculate=function(){
    var operator = this.selectedOperator;
    var op1 = parseFloat(this.input1);
    var op2 = parseFloat(this.input2);
 
    if ("-" == operator){
      
      this.resultValue = op1 - op2;
      
    }else  if ('+' == operator){
      this.resultValue = op1 + op2;
      
    }else  if ('*' == operator){
      this.resultValue = op1 * op2;
      
    }else if ('/' == operator){
      this.resultValue = op1 / op2;
    
    }else {
      
      this.resultValue = "Please select an operator!"
    }  

  } 
  
}