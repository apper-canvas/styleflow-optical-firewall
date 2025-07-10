// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getCartItems = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "quantity" } },
        { field: { Name: "size" } },
        { field: { Name: "color" } },
        { field: { Name: "added_at" } },
        { 
          field: { name: "product_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("cart_item", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(item => ({
      ...item,
      product: item.product_id
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching cart items:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const addToCart = async (cartItem) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [
        {
          Name: `Cart Item ${Date.now()}`,
          product_id: cartItem.productId,
          quantity: cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color,
          added_at: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.createRecord("cart_item", params);
    
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
      console.error("Error adding to cart:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateCartItem = async (id, updateData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [
        {
          Id: id,
          quantity: updateData.quantity,
          size: updateData.size,
          color: updateData.color
        }
      ]
    };
    
    const response = await apperClient.updateRecord("cart_item", params);
    
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
      console.error("Error updating cart item:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const removeFromCart = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("cart_item", params);
    
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
      console.error("Error removing from cart:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return false;
  }
};

export const clearCart = async () => {
  try {
    // First get all cart items
    const cartItems = await getCartItems();
    
    if (cartItems.length === 0) {
      return { success: true };
    }
    
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: cartItems.map(item => item.Id)
    };
    
    const response = await apperClient.deleteRecord("cart_item", params);
    
    if (!response.success) {
      console.error(response.message);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error clearing cart:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return { success: false };
  }
};

export const getWishlistItems = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "added_at" } },
        { 
          field: { name: "product_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("wishlist_item", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(item => item.product_id).filter(Boolean);
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching wishlist items:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const addToWishlist = async (productId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [
        {
          Name: `Wishlist Item ${Date.now()}`,
          product_id: productId,
          added_at: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.createRecord("wishlist_item", params);
    
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
      console.error("Error adding to wishlist:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const apperClient = getApperClient();
    
    // First find the wishlist item
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "product_id" } }
      ],
      where: [
        {
          FieldName: "product_id",
          Operator: "EqualTo",
          Values: [productId]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("wishlist_item", params);
    
    if (!response.success || !response.data || response.data.length === 0) {
      throw new Error("Product not found in wishlist");
    }
    
    const deleteParams = {
      RecordIds: [response.data[0].Id]
    };
    
    const deleteResponse = await apperClient.deleteRecord("wishlist_item", deleteParams);
    
    if (!deleteResponse.success) {
      console.error(deleteResponse.message);
      return false;
    }
    
    return { success: true };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error removing from wishlist:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};