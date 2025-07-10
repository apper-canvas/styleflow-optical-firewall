// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getProducts = async (filters = {}, sortBy = "featured", limit = null) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "price" } },
        { field: { Name: "discounted_price" } },
        { field: { Name: "description" } },
        { field: { Name: "brand" } },
        { field: { Name: "category" } },
        { field: { Name: "sub_category" } },
        { field: { Name: "colors" } },
        { field: { Name: "sizes" } },
        { field: { Name: "stock" } },
        { field: { Name: "is_new" } },
        { field: { Name: "is_featured" } },
        { field: { Name: "rating" } },
        { field: { Name: "review_count" } },
        { field: { Name: "images" } },
        { field: { Name: "date_added" } }
      ],
      orderBy: [
        {
          fieldName: sortBy === "newest" ? "date_added" : sortBy === "price-low" ? "price" : sortBy === "price-high" ? "price" : "is_featured",
          sorttype: sortBy === "price-high" ? "DESC" : "ASC"
        }
      ],
      pagingInfo: {
        limit: limit || 100,
        offset: 0
      }
    };

    if (filters.search) {
      params.where = [
        {
          FieldName: "Name",
          Operator: "Contains",
          Values: [filters.search]
        }
      ];
    }

    const response = await apperClient.fetchRecords("product", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching products:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "price" } },
        { field: { Name: "discounted_price" } },
        { field: { Name: "description" } },
        { field: { Name: "brand" } },
        { field: { Name: "category" } },
        { field: { Name: "sub_category" } },
        { field: { Name: "colors" } },
        { field: { Name: "sizes" } },
        { field: { Name: "stock" } },
        { field: { Name: "is_new" } },
        { field: { Name: "is_featured" } },
        { field: { Name: "rating" } },
        { field: { Name: "review_count" } },
        { field: { Name: "images" } },
        { field: { Name: "date_added" } }
      ]
    };
    
    const response = await apperClient.getRecordById("product", id, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Product not found");
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [
        {
          Name: productData.Name,
          Tags: productData.Tags,
          price: productData.price,
          discounted_price: productData.discounted_price,
          description: productData.description,
          brand: productData.brand,
          category: productData.category,
          sub_category: productData.sub_category,
          colors: productData.colors,
          sizes: productData.sizes,
          stock: productData.stock,
          is_new: productData.is_new,
          is_featured: productData.is_featured,
          rating: productData.rating,
          review_count: productData.review_count,
          images: productData.images,
          date_added: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.createRecord("product", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating product:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [
        {
          Id: id,
          Name: productData.Name,
          Tags: productData.Tags,
          price: productData.price,
          discounted_price: productData.discounted_price,
          description: productData.description,
          brand: productData.brand,
          category: productData.category,
          sub_category: productData.sub_category,
          colors: productData.colors,
          sizes: productData.sizes,
          stock: productData.stock,
          is_new: productData.is_new,
          is_featured: productData.is_featured,
          rating: productData.rating,
          review_count: productData.review_count,
          images: productData.images
        }
      ]
    };
    
    const response = await apperClient.updateRecord("product", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
      }
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating product:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("product", params);
    
    if (!response.success) {
      console.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
      }
      
      return successfulDeletions.length > 0;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting product:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return false;
  }
};