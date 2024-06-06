import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/css/productList.css';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    rating: number;
    categories: string[];
    stock: number;
  }
  
  const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orderBy, setOrderBy] = useState<string>(() => {
      const storedOrderBy = localStorage.getItem('orderBy');
      return storedOrderBy || 'name.ASC';
    });
    const [offset, setOffset] = useState<number>(() => {
      const storedOffset = localStorage.getItem('offset');
      return Number(storedOffset) || 0;
    });
    const [limit, setLimit] = useState<number>(() => {
      const storedLimit = localStorage.getItem('limit');
      return Number(storedLimit) || 6;
    });
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [category, setCategory] = useState<string>('');
    const location = useLocation();
    useEffect(() => {
      const query = new URLSearchParams(location.search);
      const category = query.get('id') || '';
      setCategory(category);
      fetchProducts(category, orderBy, offset, limit);
      localStorage.setItem('orderBy', orderBy);
      localStorage.setItem('offset', offset.toString());
      localStorage.setItem('limit', limit.toString());
    }, [location.search, orderBy, offset, limit]);
  
    const fetchProducts = async (category: string, orderBy: string, offset: number, limit: number) => {
      try {
        const response = await fetch(`http://localhost:5000/products?categories=${category}&orderBy=${orderBy}&offset=${offset}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Hiba a termékek lekérdezése során');
        }
        const data = await response.json();
        setProducts(data.data);
        setTotalProducts(data.total);
        const totalPages = Math.ceil(data.total / limit);
        if (totalPages <= 1 && offset !== 0) setOffset(0);
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    };
  
    const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setOrderBy(e.target.value);
    };
  
    const handlePageChange = (newOffset: number) => {
      setOffset(newOffset);
    };

    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    
    
  
    return (
      <div>
          <div className="center-content">
              <h1>{category}</h1>
              <div>
                  <label>Rendezés:</label>
                  <select value={orderBy} onChange={handleSortChange}>
                      <option value="name.ASC">Név szerint növekvő</option>
                      <option value="name.DESC">Név szerint csökkenő</option>
                      <option value="price.ASC">Ár szerint növekvő</option>
                      <option value="price.DESC">Ár szerint csökkenő</option>
                      <option value="rating.ASC">Értékelés szerint növekvő</option>
                      <option value="rating.DESC">Értékelés szerint csökkenő</option>
                  </select>
              </div>
          </div>
          <div className="product-grid">
              {products.map((product) => (
                  <a className="product-item" key={product.id} href={'http://localhost:3000/product/' + product.id}>
                      <img src={product.image} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <p>Ár: {product.price} Ft</p>
                      <p>{product.stock > 0 ? 'Rendelhető' : 'Nincs készleten'}</p>
                      <p>Értékelés: {'★'.repeat(product.rating)}</p>
                  </a>
              ))}
          </div>
          {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(offset - limit)} disabled={offset <= 0}>Előző</button>
                    {[...Array(totalPages)].map((_, index) => (
                        <span
                            key={index}
                            className={`page-number ${index + 1 === currentPage ? 'active' : ''}`}
                            onClick={() => handlePageChange(index * limit)}
                        >
                            {index + 1}
                        </span>
                    ))}
                    <button onClick={() => handlePageChange(offset + limit)} disabled={offset + limit >= totalProducts}>Következő</button>
                </div>
            )}
        </div>
    );
};
  
  export default ProductList;