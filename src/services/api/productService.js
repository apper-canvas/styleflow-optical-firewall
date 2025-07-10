import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (filters = {}, sortBy = "featured", limit = null) => {
  await delay(300);
  
  let filteredProducts = [...productsData];
  
  // Apply filters
if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.Name.toLowerCase().includes(searchTerm) ||
      product.Brand.toLowerCase().includes(searchTerm) ||
      product.Category.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.categories && filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      filters.categories.includes(product.Category)
    );
  }
  
  if (filters.brands && filters.brands.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      filters.brands.includes(product.Brand)
    );
  }
  
  if (filters.sizes && filters.sizes.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.Sizes && product.Sizes.some(size => filters.sizes.includes(size))
    );
  }
  
  if (filters.colors && filters.colors.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.Colors && product.Colors.some(color => filters.colors.includes(color))
    );
  }
  
  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter(product => {
      const price = product.DiscountedPrice || product.Price;
      return price >= (filters.priceRange.min || 0) && price <= (filters.priceRange.max || 10000);
    });
  }
  
  if (filters.discount && filters.discount > 0) {
    filteredProducts = filteredProducts.filter(product => {
      if (product.DiscountedPrice) {
        const discountPercentage = Math.round(((product.Price - product.DiscountedPrice) / product.Price) * 100);
        return discountPercentage >= filters.discount;
      }
      return false;
    });
  }
  
  // Apply sorting
  switch (sortBy) {
case "price-low":
      filteredProducts.sort((a, b) => {
        const priceA = a.DiscountedPrice || a.Price;
        const priceB = b.DiscountedPrice || b.Price;
        return priceA - priceB;
      });
      break;
    case "price-high":
      filteredProducts.sort((a, b) => {
        const priceA = a.DiscountedPrice || a.Price;
        const priceB = b.DiscountedPrice || b.Price;
        return priceB - priceA;
      });
      break;
    case "newest":
      filteredProducts.sort((a, b) => b.Id - a.Id);
      break;
    case "popularity":
      filteredProducts.sort((a, b) => Math.random() - 0.5);
      break;
case "discount":
      filteredProducts.sort((a, b) => {
        const discountA = a.DiscountedPrice ? ((a.Price - a.DiscountedPrice) / a.Price) * 100 : 0;
        const discountB = b.DiscountedPrice ? ((b.Price - b.DiscountedPrice) / b.Price) * 100 : 0;
        return discountB - discountA;
      });
      break;
    default:
      // Featured - keep original order
      break;
  }
  
  if (limit) {
    filteredProducts = filteredProducts.slice(0, limit);
  }
  
  return filteredProducts;
};

export const getProductById = async (id) => {
  await delay(200);
  
  const product = productsData.find(p => p.Id === id);
  if (!product) {
    throw new Error("Product not found");
  }
  
  return { ...product };
};

export const createProduct = async (productData) => {
  await delay(300);
  
  const newId = Math.max(...productsData.map(p => p.Id)) + 1;
  const newProduct = {
    Id: newId,
    ...productData,
    inStock: true
  };
  
  productsData.push(newProduct);
  return { ...newProduct };
};

export const updateProduct = async (id, productData) => {
  await delay(300);
  
  const index = productsData.findIndex(p => p.Id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  
  productsData[index] = { ...productsData[index], ...productData };
  return { ...productsData[index] };
};

export const deleteProduct = async (id) => {
  await delay(300);
  
  const index = productsData.findIndex(p => p.Id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  
  productsData.splice(index, 1);
  return { success: true };
};