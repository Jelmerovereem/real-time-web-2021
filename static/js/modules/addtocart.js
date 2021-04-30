import { socket, userId } from "../main.js";

export default function addToCart(event) {
	const btn = event.target;
	const productId = btn.dataset.productid;
	const productName = btn.dataset.productname;
	if (localStorage.getItem("cartProducts")) {
		let cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
		cartProducts.push({
			productId,
			productName
		});
		localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
	} else {
		console.log(productName)
		localStorage.setItem("cartProducts", JSON.stringify([{
			productId,
			productName
		}]));
	}

	let cartData = JSON.parse(localStorage.getItem("cartProducts"))

	let data = {
		userId,
		cartData
	}
	socket.emit("addToCart", data);
}