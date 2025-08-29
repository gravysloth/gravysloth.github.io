class Shop {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.inventory;
  }

  draw() {
    push();
    rect(this.x, this.y, this.w, this.h);
    pop();
  }

  setUpShop() {
    this.inventory = {};
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

class ShopItem extends Thing {
  constructor(x, y, imageArray) {
    super(x, y, imageArray);
    this.name = "ShopItem";
    this.price = 0;
  }

  update() {
    super.update();

    return !this.dead;
  }
}

class Composter extends ShopItem {
  constructor(x, y) {
    super(x, y, [loadImage("imgs/composter.png")]);
    this.name = "Composter";
    this.price = 20;

    this.poopCount = 0;
  }

  update() {
    super.update();

    return !this.dead;
  }

  /** Returns poop taken */
  addPoopIfNotFull(num) {
    const poopSpaceLeft = 3 - this.poopCount;
    if (poopSpaceLeft < num) {
      this.poopCount = 3;
      return poopSpaceLeft;
    } else {
      this.poopCount += num;
      return num;
    }
  }
}
