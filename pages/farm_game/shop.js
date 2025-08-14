class Shop {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.addShopItem(Composter);
  }

  draw() {
    push();
    rect(this.x, this.y, this.w, this.h);
    pop();
  }

  addShopItem(item) {
    const shopDiv = document.getElementById("shopTable");
    const line = document.createElement("tr");
    line.innerHTML =
      "<td>" +
      item.value +
      "</td><td>" +
      item.name +
      '</td><td><button type="button" onclick="shop.buy(\'' +
      item.name +
      "')\">Click Me!</button></td>";
    shopDiv.appendChild(line);
  }

  buy(name) {
    console.log(name);
  }
}
