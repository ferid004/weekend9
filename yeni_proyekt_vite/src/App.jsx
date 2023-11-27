import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [basket, setBasket] = useState(localStorage.getItem('bassss') ? JSON.parse(localStorage.getItem('bassss')) : [])
  const [wish, setWish] = useState(localStorage.getItem('wisss') ? JSON.parse(localStorage.getItem('wisss')) : [])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0);

  /////////////////////////////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(4);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const [displayedProducts, setDisplayedProducts] = useState(currentProducts);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const indexOfLastProduct = pageNumber * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const newDisplayedProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    setDisplayedProducts(newDisplayedProducts);
  };


  useEffect(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const initialDisplayedProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    setDisplayedProducts(initialDisplayedProducts);
  }, [currentPage, products, productsPerPage]);





  ////////////////////////////////////////////////////////

  //7777777777777777777777777777777777
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    if (selectedColors.length > 0) {
      const filteredProducts = products.filter((product) => selectedColors.includes(product.color));
      setDisplayedProducts(filteredProducts);
    } else {
      setDisplayedProducts(currentProducts);
    }
  }, [selectedColors, currentProducts, products]);

  const handleColorChange = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((selectedColor) => selectedColor !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  //777777777777777777777777777777777
  //111111111111111111111111111111111
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    if (selectedSizes.length > 0) {
      const filteredProducts = products.filter((product) => selectedSizes.includes(product.size));
      setDisplayedProducts(filteredProducts);
    } else {
      setDisplayedProducts(currentProducts);
    }
  }, [selectedSizes, currentProducts, products]);

  const handleSizeChange = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((selectedSize) => selectedSize !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };
  //111111111111111111111111111111111
  //222222222222222222222222222222222
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const filteredProducts = products.filter((product) => selectedCategories.includes(product.category));
      setDisplayedProducts(filteredProducts);
    } else {
      setDisplayedProducts(currentProducts);
    }
  }, [selectedCategories, currentProducts, products]);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((selectedCategory) => selectedCategory !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  //222222222222222222222222222222222
  //000000000000000000000000000000000 
  useEffect(() => {
    const filteredProducts = currentProducts.filter((product) => {
      const colorFilter = selectedColors.length === 0 || selectedColors.includes(product.color);
      const sizeFilter = selectedSizes.length === 0 || selectedSizes.includes(product.size);
      const categoryFilter = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      return colorFilter && sizeFilter && categoryFilter;
    });

    setDisplayedProducts(filteredProducts);
  }, [selectedColors, selectedSizes, currentProducts]);
  //000000000000000000000000000000000
  useEffect(() => {
    getProducts()
  }, [])
  useEffect(() => {
    const total = basket.reduce((total, item) => {
      const itemPrice = item.prices || 0;
      return total + (item.count || 1) * itemPrice;
    }, 0);
    setTotalPrice(total);
    console.log(total);
  }, [basket]);

  useEffect(() => {
    localStorage.setItem('wisss', JSON.stringify(wish))
  }, [wish])
  useEffect(() => {
    localStorage.setItem('bassss', JSON.stringify(basket)); // Buraya eklendi
  }, [basket]);

  async function getProducts() {
    const data = await fetch('http://localhost:3000/products')
    const res = await data.json()
    setProducts(res)
    setIsLoading(false)
  }

  function haddleAddWish(x) {
    if (!wish.find(item => item.id === x.id)) {
      setWish([...wish, x])
    }
  }
  function hadlleRemoveWish(id) {
    setWish(wish.filter(x => x.id !== id))
  }
  function hadlleRemoveAllWish() {
    setWish([])
  }

  function haddleAddBasket(x) {
    if (!basket.find((item) => item.id === x.id)) {
      setBasket([...basket, { ...x, count: 1 }]);
    } else {
      setBasket((e) =>
        e.map((item) =>
          item.id === x.id ? { ...item, count: item.count + 1 } : item
        )
      );
    }
  }
  function hadlleCountVal(id, action) {
    setBasket((e) =>
      e.map((item) =>
        item.id === id
          ? { ...item, count: action === 'increase' ? item.count + 1 : Math.max(1, item.count - 1) }
          : item
      )
    );
  }

  function hadlleRemove(id) {
    setBasket(basket.filter(x => x.id !== id))
  }
  function hadlleRemoveAll() {
    setBasket([])
  }





  return (
    <>
      <div className='wishcss'>
        <h4>wish list</h4>
        <button onClick={hadlleRemoveAllWish}>remove all</button>
        {wish.map(x => <ul key={x.id}>
          {x.src && (
            <div>
              <img src={x.src} alt={x.title} style={{ maxWidth: '100px', maxHeight: '100px' }} />
            </div>
          )}
          <li>{x.id}</li>
          <li>adi : {x.name}</li>
          <li>qiymet :{x.prices}</li>
          <button onClick={() => hadlleRemoveWish(x.id)} >remove</button>
        </ul>
        )}

      </div>
      <div className='basketcss'>
        <h4>basketim</h4>
        <button onClick={hadlleRemoveAll}>remove all</button>
        <p>toplam qiymeti : {totalPrice} manant</p>
        {basket.map(x => <ul key={x.id}>
          {x.src && (
            <div>
              <img src={x.src} alt={x.title} style={{ maxWidth: '100px', maxHeight: '100px' }} />
            </div>
          )}
          <li>{x.id}</li>
          <li>adi : {x.name}</li>
          <li>qiymet :{x.prices}</li>
          <li>sayi: {x.count}</li>
          <li>ölçü: {x.size}</li>

          <button onClick={() => hadlleCountVal(x.id, 'increase')} >+</button>
          <button onClick={() => hadlleCountVal(x.id, 'decrease')} >-</button><br />
          <button onClick={() => hadlleRemove(x.id)} >remove</button>
        </ul>
        )}

      </div>
      <h3>umumi hisse</h3>
      <button onClick={() => setProductsPerPage(2)}>2-2</button>
      <button onClick={() => setProductsPerPage(4)}>4-4</button>
      <button onClick={() => setProductsPerPage(6)}>6-6</button>
      <div className='pagination'>
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => i + 1).map(
          (number) => (
            <button key={number} onClick={() => paginate(number)}>
              {number}
            </button>
          )
        )}
      </div>
      <div>
        <p>regler</p>
        <label>
          <input type="checkbox" value="ağ" onChange={() => handleColorChange("ağ")} />
          AĞ
        </label>
        <label>
          <input type="checkbox" value="qara" onChange={() => handleColorChange("qara")} />
          QARA
        </label>
        <label>
          <input type="checkbox" value="boz" onChange={() => handleColorChange("boz")} />
          BOZ
        </label>
        <label>
          <input type="checkbox" value="goy" onChange={() => handleColorChange("goy")} />
          GOY
        </label>
      </div>
      <div>
        <p>ölçüler</p>
        <label>
          <input type="checkbox" value="s" onChange={() => handleSizeChange("s")} />
          S
        </label>
        <label>
          <input type="checkbox" value="m" onChange={() => handleSizeChange("m")} />
          M
        </label>
        <label>
          <input type="checkbox" value="l" onChange={() => handleSizeChange("l")} />
          L
        </label>
        <label>
          <input type="checkbox" value="x" onChange={() => handleSizeChange("x")} />
          X
        </label>
        <label>
          <input type="checkbox" value="xl" onChange={() => handleSizeChange("xl")} />
          XL
        </label>
      </div>
      <div>
        <p>katagoriyalar</p>
        <label>
          <input type="checkbox" value="gömlek" onChange={() => handleCategoryChange("gömlek")} />
          KÖYNƏK
        </label>
        <label>
          <input type="checkbox" value="pantolon" onChange={() => handleCategoryChange("pantolon")} />
          ŞALVAR
        </label>
      </div>

      <div className='viwe'>
        {isLoading ? <p> loding ...</p > : <>

          {/* {products.map(x => */}
          {displayedProducts.map(x =>
            <div className='box3'>
              <ul key={x.id} style={{ display: 'flex', gap: "20px" }}>
                <div>
                  {x.src && (
                    <div>
                      <img src={x.src} alt={x.title} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    </div>
                  )}
                </div>
                <div>
                  <li> id :{x.id}</li>
                  <li>adi : "{x.name}"</li>
                  <li>giysi tipi : "{x.category}"</li>
                  <li>qiymet : "{x.prices}"</li>
                  <li>brend : "{x.brand}"</li>
                  <li>rəngi : "{x.color}"</li>
                  <li>ölçüsü : "{x.size}"</li>
                </div>

              </ul>
              <button onClick={() => haddleAddBasket(x)}>add basket</button>
              <button onClick={() => haddleAddWish(x)}>add wish list</button>
            </div>
          )}

        </>}
      </div>
    </>
  )
}

export default App
