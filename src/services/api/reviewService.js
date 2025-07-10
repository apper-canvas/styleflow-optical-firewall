// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getReviews = async (productId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "product_id" } },
        { field: { Name: "user_name" } },
        { field: { Name: "rating" } },
        { field: { Name: "comment" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      where: [
        {
          FieldName: "product_id",
          Operator: "EqualTo",
          Values: [productId]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("review", params);
    
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
      console.error("Error fetching reviews:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const addReview = async (reviewData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [
        {
          Name: `Review by ${reviewData.userName}`,
          product_id: reviewData.productId,
          user_name: reviewData.userName,
          rating: reviewData.rating,
          comment: reviewData.comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.createRecord("review", params);
    
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
      console.error("Error adding review:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateReview = async (id, reviewData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [
        {
          Id: id,
          user_name: reviewData.userName,
          rating: reviewData.rating,
          comment: reviewData.comment,
          updated_at: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.updateRecord("review", params);
    
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
      console.error("Error updating review:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("review", params);
    
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
      console.error("Error deleting review:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return false;
  }
};

export const getReviewsSummary = async (productId) => {
  try {
    const reviews = await getReviews(productId);
    
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    const ratingBreakdown = reviews.reduce((breakdown, review) => {
      breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
      return breakdown;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    
    return {
      totalReviews: reviews.length,
      averageRating: parseFloat(averageRating.toFixed(1)),
      ratingBreakdown
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching review summary:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
};