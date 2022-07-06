import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../Home/Home"
import Signup from "../Signup/Signup"
import Login from "../Login/Login"
import Orders from "../Orders/Orders"
import NotFound from "../NotFound/NotFound"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import apiClient from "../../services/apiClient"
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart"
import "./App.css"

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All Categories")
  const [searchInputValue, setSearchInputValue] = useState("")
  const [user, setUser] = useState({})
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState({})
  const [isFetching, setIsFetching] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState(null)

  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item))
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item))
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item)
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart)

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value)
  }

  const handleOnCheckout = async () => {

    setIsCheckingOut(true)

    const { data, error } = await apiClient.createOrder({ order: cart });

    if (error) {
      const message = error?.response?.data?.error?.message
      setError(message ?? String(error))
    }
    
    if (data) {
      setCart({});
      return data
    }

    setIsCheckingOut(false)

    // try {
    //   const res = await axios.post("http://localhost:3001/orders", { order: cart })
    //   if (res?.data?.order) {
    //     setOrders((o) => [...res.data.order, ...o])
    //     setIsCheckingOut(false)
    //     setCart({})
    //     return res.data.order
    //   } else {
    //     setError("Error checking out.")
    //   }
    // } catch (err) {
    //   console.log(err)
    //   const message = err?.response?.data?.error?.message
    //   setError(message ?? String(err))
    // } finally {
    //   setIsCheckingOut(false)
    // }
  }

  useEffect(() => {
    const fetchProducts = async () => {

      setIsFetching(true)

      const { data, error } = await apiClient.fetchProducts();

      if (error) {
        const message = error?.response?.data?.error?.message
        setError(message ?? String(error))
      }

      if (data) {
        setProducts(data.products)
      }

      setIsFetching(false)

      // try {
      //   const res = await axios.get("http://localhost:3001/store")
      //   if (res?.data?.products) {
      //     setProducts(res.data.products)
      //   } else {
      //     setError("Error fetching products.")
      //   }
      // } catch (err) {
      //   console.log(err)
      //   const message = err?.response?.data?.error?.message
      //   setError(message ?? String(err))
      // } finally {
      //   setIsFetching(false)
      // }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {

      const { data, error } = await apiClient.fetchUserFromToken()

      if (data) {
        setUser(data.user)
      }

      if (error) {
        setError(error)
      }
    }

    const token = localStorage.getItem("student_store_token");

    if (token) {
      apiClient.setToken(token);
      fetchUser();
    }

  }, [])

  const handleLogout = async () => {
    await apiClient.logoutUser()
    setUser({});
    setError(null);
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                user={user}
                error={error}
                products={products}
                isFetching={isFetching}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchInputValue={searchInputValue}
                handleOnSearchInputChange={handleOnSearchInputChange}
                addToCart={handleOnAddToCart}
                removeFromCart={handleOnRemoveFromCart}
                getQuantityOfItemInCart={handleGetItemQuantity}
                handleLogout={handleLogout}
              />
            }
          />
          <Route path="/login" element={<Login user={user} setUser={setUser} />} />
          <Route path="/signup" element={<Signup user={user} setUser={setUser} />} />
          <Route
            path="/orders"
            element={
              <Orders
                user={user}
                error={error}
                orders={orders}
                setUser={setUser}
                products={products}
                isFetching={isFetching}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchInputValue={searchInputValue}
                handleOnSearchInputChange={handleOnSearchInputChange}
              />
            }
          />
          <Route
            path="/shopping-cart"
            element={
              <ShoppingCart
                user={user}
                cart={cart}
                error={error}
                setUser={setUser}
                products={products}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchInputValue={searchInputValue}
                handleOnSearchInputChange={handleOnSearchInputChange}
                addToCart={handleOnAddToCart}
                removeFromCart={handleOnRemoveFromCart}
                getQuantityOfItemInCart={handleGetItemQuantity}
                getTotalItemsInCart={handleGetTotalCartItems}
                isCheckingOut={isCheckingOut}
                handleOnCheckout={handleOnCheckout}
              />
            }
          />
          <Route
            path="*"
            element={
              <NotFound
                user={user}
                error={error}
                products={products}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchInputValue={searchInputValue}
                handleOnSearchInputChange={handleOnSearchInputChange}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
