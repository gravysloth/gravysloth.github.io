class Shop {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.addShopItem("test", 10)
    }

    draw() {
        push()
        rect(this.x, this.y, this.w, this.h)
        pop()
    }

    addShopItem(name, price) {
        const shopDiv = document.getElementById("shopTable")
        const line = document.createElement('tr')
        line.innerHTML = '<td>' + price + '</td><td>' + name + '</td><td><button type="button">Click Me!</button></td>'
        shopDiv.appendChild(line)
    }
}