class Shop {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    push();
    rect(this.x, this.y, this.w, this.h);
    pop();
  }

  setUpShop() {
    this.addShopItem(new Composter(0, 0));
  }

  addShopItem(item) {
    const shopDiv = document.getElementById("shopTable");
    const line = document.createElement("tr");
    line.id = item.name;
    line.innerHTML = "<td>$" + item.price + "</td><td>" + item.name + "</td>";
    line.onclick = function () {
      if (shop.buyItem(item)) {
        console.log("you bought a " + item.name);
      } else {
        console.log(
          "you can't buy " +
            item.name +
            ". need " +
            (item.price - menu.wallet) +
            " more moneys"
        );
      }
    };
    shopDiv.appendChild(line);
  }

  buyItem(item) {
    if (menu.wallet >= item.price) {
      CreateThing(
        Object.assign(Object.create(Object.getPrototypeOf(item)), item)
      );
      menu.wallet -= item.price;
      return true;
    }
    return false;
  }
}
