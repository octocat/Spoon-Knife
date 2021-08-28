console.log("Hello World");

showMoreProducts();

var prod = "";
var n = 1;

// this function is to add 8 products eatch time that the user click on button "Ainda mais produtos aqui"
function showMoreProducts(){

	var page = "https://frontend-intern-challenge-api.iurykrieger.now.sh/products?page=" + n;

	fetch(page)
		.then(res => res.json())
		.then((out) => {
			console.log('Output: ', out);
			
			for(let i = 0; i < 8; i++){
				prod += '<div class="product">' +
					'<img src="http:' + out.products[i].image + '" alt="">' +
					'<p class="name">'+ out.products[i].name +'</p>' +
					'<p class="description">'+ out.products[i].description +'</p>' +
					'<p class="oldPrice">De: R$'+ out.products[i].oldPrice +',99</p>' +
					'<p class="price">Por: R$'+ out.products[i].price +',99</p>' +
					'<p class="installments">ou '+ out.products[i].installments.count +'x de R$'+ out.products[i].installments.value +',99</p>' +
					'<button>Comprar</button>' +
					'</div>';
			}
			document.getElementById('addProd').innerHTML = prod;
			n += 1;

		}).catch(err => console.error(err));
}
