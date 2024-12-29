export default class Filters {
    constructor(products) {
        this.products = products
    }

    filterByCategory(category) {
        this.products = category ? this.products.filter(product => product.category == category) : this.products
        return this
    }

    filterByRating(rating) {
        this.products = rating ? this.products.filter(product => Math.floor(product.rating) == rating) : this.products
        return this
    }

    filterByPrice(from , to) {
        this.products = from ? this.products.filter(product => product.price >= from) : this.products
        this.products = to ? this.products.filter(product => product.price <= to) : this.products
        return this
    }

    getProductsData () {
        return this.products
    }
}