import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { searchProducts } from '../components/searchProducts';
import { createRequestURL } from '../components/searchProducts';
import '../components/css/searchPage.css';

const SEARCHPAGE = () => {
  const navigate = useNavigate();
  const { params } = useParams<{ params: string }>();

  useEffect(() => {
    const getAll = async () => {
      try {
        if (params) {
          const searchParams = new URLSearchParams(params);
          searchParams.set('offset', '0');
          searchParams.set('limit', '100');
          const newParams = searchParams.toString();
          const data = await searchProducts(newParams);
          setAllProducts(data.length);
        }
      } catch (error) {
          console.log(error);
      }
    };

    const get = async () => {
        try {
            if (params) {
                const data = await searchProducts(params);
                setProducts(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    getAll();
    get();
}, [params]);


  const [allProducts, setAllProducts] = useState<number>(0);
  const [products, setProducts] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');
  const [inStock, setInStock] = useState<boolean | undefined>();  
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(6);

  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minRate, setMinRate] = useState<number | undefined>();
  const [maxRate, setMaxRate] = useState<number | undefined>();

  const handleMinRateChange = (rate: number) => {
    if (rate <= 5 && rate >= 1) {
      setMinRate(rate);
    }
    if (rate === undefined || rate === null || rate > 5 || rate < 1) {
      setMinRate(1);
    }
  };

  const handleMaxRateChange = (rate: number) => {
    if (rate >= 1 && rate <= 5) {
      setMaxRate(rate);
    }
    if (rate === undefined || rate === null || rate > 5 || rate < 1) {
      setMaxRate(5);
    }
  };
  
  return (
  <main>
    <form className='search-container' onSubmit={search}>
      <h2>Termékek keresése</h2>

        <div>
          <label>Keress szó alapján: </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <label>Minimum ár: </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Maximum ár: </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Raktáron: </label>
          <div className='stock-row'>
            <input
              type="radio"
              name='stock'
              id='inStock'
              onChange={(e) => setInStock(true)}
            />
            <label htmlFor="inStock">Raktáron</label>
          </div>
          <div className='stock-row'>
            <input
              type="radio"
              name='stock'
              id='notInStock'
              onChange={(e) => setInStock(false)}
            />
            <label htmlFor="notInStock">Elfogyott</label>
          </div>        
        </div>
        <div>
          <label>Minimum értékelés: </label>
          <input
            type="number"
            value={minRate}
            onChange={(e) => handleMinRateChange(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Maximum értékelés: </label>
          <input
            type="number"
            value={maxRate}
            onChange={(e) => handleMaxRateChange(Number(e.target.value))}
          />
        </div>
        <button type="submit">Keresés</button>
    </form>

    <div className='results-container'>
      {products.length > 0 ? (
          products.map((product) => (
            <a key={product.id} className='product' href={'http://localhost:3000/product/' + product.id}>
              <img src={product.image} />
              <div className='data'>
                 <h3>{product.name}</h3>
                <p>Ár: {product.price} Ft</p>
                <p>Értékelés: {'★'.repeat(product.rating)}</p>
                <p>{product.stock > 0 ? 'Készlet: ' + product.stock + 'db raktáron' : 'Nincs raktáron'}</p>
              </div>
            </a>
          ))
        ) : (
          <div className='results-empty-container'>
            <p className='results-empty'>Nem található a keresés feltételeinek megfelelő termék</p>
          </div>
        )}
    </div>

    <div className='pages'>
      {offset != 0 && (
        <button onClick={previousPage} >Előző oldal</button>
      )}

      {offset+limit < allProducts && (
        <button onClick={nextPage} >Következő oldal</button>
      )}
    </div>


  </main>
  );

  function search() {
    setOffset(0);
    setLimit(6);

    if (minRate??0 > 5) {
      setMinRate(5);
    } else if (minRate??0 < 0) {
      setMinRate(0);
    }

    if (maxRate??0 < 0) {
      setMaxRate(0);
    } else if (maxRate??0 > 5) {
      setMaxRate(5);
    }

    let requestURL = createRequestURL({
      query,
      minPrice,
      maxPrice,
      inStock,
      minRate,
      maxRate,
      offset,
      limit,});

      const url = '/search/' + requestURL;
      navigate(url);
  }

  function previousPage() {
    const searchParams = new URLSearchParams("?" + params);
    const offsetParam = searchParams.get('offset');
    const offset = offsetParam !== null ? parseInt(offsetParam) : 0;

    if (offset > 0) {
      const newOffset = offset-limit;
      setOffset(newOffset);

      let requestURL = createRequestURL({
            query,
            minPrice,
            maxPrice,
            inStock,
            minRate,
            maxRate,
            offset : newOffset,
            limit,});

      const url = '/search/' + requestURL;
      navigate(url);
    }
  }

  function nextPage() {
    const searchParams = new URLSearchParams("?" + params);
    const offsetParam = searchParams.get('offset');
    const offset = offsetParam !== null ? parseInt(offsetParam) : 0;


    const newOffset = offset+limit;
      setOffset(newOffset);

    let requestURL = createRequestURL({
      query,
      minPrice,
      maxPrice,
      inStock,
      minRate,
      maxRate,
      offset: newOffset,
      limit,});
      
      const url = '/search/' + requestURL;
      navigate(url);
}
}

export default SEARCHPAGE;