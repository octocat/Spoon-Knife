const button = document.querySelector("button");
const counter = document.querySelector("div");
let num = 0;
button.addEventListener("click", () => {
  counter.innerHTML = ++num;
});
