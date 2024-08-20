const path = require("path");
const fs = require("fs");
const cart = require("./cart");
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, description, imageUrl, price) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static getFindId(productId, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === productId);
      cb(product);
    });
  }
  static deleteById(productId) {
    getProductsFromFile((products) => {
      const updatedProduct = products.filter(
        (product) => product.id !== productId
      );
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if (!err) {
          cart.deleteProduct(productId);
        }
      });
    });
  }
};
