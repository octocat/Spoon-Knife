console.log("estamos vigentes por la madre patria");

class Animal{
constructor({name,size,color}){
this.name=name;
this.color=color;
this.size=size;
}

correr(){
    return this.name + " puede correr sin problemas"
}

};

const zorro= new Animal({name:"zorro",color:"rojo",size:"50cm"});

console.log(zorro.correr());

