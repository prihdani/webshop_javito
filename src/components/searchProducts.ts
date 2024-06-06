import React, { useState } from 'react';
import SearchParams from './searchParams';

export const createRequestURL = (param: SearchParams) => {
    const searchParams = new URLSearchParams();
    for (const key in param) {
        if (param.hasOwnProperty(key) && param[key] !== undefined && param[key] !== '') {
            const paramValue = param[key] ?? '';
            if (Array.isArray(paramValue)) {
                paramValue.forEach((value: string) => searchParams.append(key, value));
            } else {
                searchParams.append(key, paramValue.toString());
            }
        }
    }

    return searchParams;
}

export const searchProducts = async (params: string) => {
    const requestUrl = `http://localhost:5000/products?${params}`;

    try {
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Response was not ok');
        }

        const data = await response.json();
        
        return data.data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

export const getProduct = async (param: string) => {
    const requestUrl = `http://localhost:5000/products/${param}`;

    try {
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }

}