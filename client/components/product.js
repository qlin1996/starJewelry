import React from 'react'
import {connect} from 'react-redux'
import {fetchProductThunk} from '../store/product'
import {fetchCartThunk, addCartItemThunk} from '../store/cart'
import {me} from '../store/user'
import {Link} from 'react-router-dom'
import Modal from './modal'

class Product extends React.Component {
  constructor() {
    super()
    this.state = {
      isOpen: false
    }
    this.handleClose = this.handleClose.bind(this)
  }

  async componentDidMount() {
    await this.props.me()
    await this.props.fetchCartThunk(this.props.user.id)
    await this.props.fetchProductThunk(this.props.match.params.productId)
  }

  capitalizeFirstLetter = str => {
    let arr = str.toLowerCase().split(' ')
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1)
    }
    return arr.join(' ')
  }

  handleSubmit = event => {
    if (this.props.user.id) {
      event.preventDefault()
      this.props.addCartItemThunk(
        this.props.user.id,
        this.props.cart.id,
        this.props.product.id,
        this.props.product.price
      )
    } else {
      this.setState({isOpen: true})
    }
  }

  handleClose() {
    this.setState({isOpen: false})
  }

  render() {
    const product = this.props.product || {}
    return (
      <div className="single-product-grid">
        <Modal open={this.state.isOpen} handleClose={this.handleClose} />
        <div className="single-product-card">
          <img src={product.imageUrl} className="single-product-img " />
        </div>
        <div className="single-product-card">
          <h2>{product.name && this.capitalizeFirstLetter(product.name)}</h2>
          <p>{product.description}</p>
          <p>$ {product.price && product.price.toFixed(2)}</p>
          <div className="edit-product">
            <button
              className="button"
              type="submit"
              onClick={this.handleSubmit}
            >
              Add to Cart
            </button>
          </div>
          {this.props.user.isAdmin === 'yes' && (
            <div>
              <Link to={`/products/${this.props.product.id}/edit`}>
                <button className="button" type="button">
                  Edit Product
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user,
  product: state.product,
  cart: state.cart
})

const mapDispatch = dispatch => ({
  fetchProductThunk: productId => dispatch(fetchProductThunk(productId)),
  addCartItemThunk: (userId, cartId, productId, cartItemPrice) =>
    dispatch(addCartItemThunk(userId, cartId, productId, cartItemPrice)),
  me: () => dispatch(me()),
  fetchCartThunk: userId => dispatch(fetchCartThunk(userId))
})

export default connect(mapState, mapDispatch)(Product)
