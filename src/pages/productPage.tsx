import React, { useState, useEffect } from 'react';
import '../components/css/productPage.css';
import '../components/css/loading.css';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../components/searchProducts';

const PRODUCTPAGE = () => {
    const [productData, setProductData] = useState<any>(null);
    const { productId } = useParams<{ productId: string }>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                if (productId) {
                    const data = await getProduct(productId);
                    document.title = data.name;
                    setProductData(data);
                    setLoading(false);
                }
            } catch (error) {
                document.title = 'Ismeretlen termék';
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    if (loading) {
        return (
            <main className='main-container'>
                <div className='loading'>
                    <div className="loader">
                        <li className="ball"></li>
                        <li className="ball"></li>
                        <li className="ball"></li>
                    </div>
                    <p>Termék betöltése...</p>
                </div>
                
            </main>
        );
    }

    return (
        <main className='main-container'>
            { !loading && productData ? 
            (
                <div className='product-data'>
                    <h1>{productData.name}</h1>
                    <img src={productData.image}/>
                    <p>{productData.description}</p>
                    <p>Ár: {productData.price} Ft</p>
                    <p>Értékelés: {'★'.repeat(productData.rating)}</p>
                    <p>Raktáron: {productData.stock} units</p>
                    <div className='categories'>
                        <h2>Kategóriák:</h2>
                        <ul>
                            {productData.categories?.map((category: any) => (
                                <li key={category}>
                                    
                                    <Link to={'/products/categories?id=' + category}>
                                        <img src={productData.image} alt="" />
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <main className='main container'>
                    <p>A termék nem létezik</p>
                    <p>Kattints <Link to="/">ide</Link> a Home-ra lépéshez</p>
                </main>
            ) }
        </main>
    );
}

export default PRODUCTPAGE;