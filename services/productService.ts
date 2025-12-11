import { Product } from '../types';
import { MOCK_PRODUCTS, FULL_ACCESS_PRODUCT } from '../constants';

// In a real setup, this URL would point to your generated JSON file
// e.g., "https://your-website.com/data/products.json"
// or a Google Sheet CSV export link.
const DATA_SOURCE_URL = '/data/products.json'; 

export const fetchProducts = async (): Promise<Product[]> => {
  // Simulate network delay for a realistic "App" feel
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    // UNCOMMENT THIS BLOCK TO USE REAL EXTERNAL DATA
    /*
    const response = await fetch(DATA_SOURCE_URL);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data;
    */

    // For now, return the mock database
    return MOCK_PRODUCTS;
  } catch (error) {
    console.error("Error loading products:", error);
    // Fallback to offline/mock data if fetch fails
    return MOCK_PRODUCTS;
  }
};

export const fetchBundle = async (): Promise<Product> => {
    // In the future, you can also fetch the bundle details dynamically
    return FULL_ACCESS_PRODUCT;
};