import { ref, computed } from 'vue';

export const useFavorites = () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;
  const token = useCookie('token');
  
  const favorites = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isFavorited = (productId: number) => {
    return favorites.value.some(p => p.id === productId);
  };

  const fetchFavorites = async () => {
    if (!token.value) {
      favorites.value = [];
      return;
    }
    
    isLoading.value = true;
    try {
      const data = await $fetch<any[]>(`${apiUrl}/favorites`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      favorites.value = data;
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      error.value = 'Gagal memuat favorit';
    } finally {
      isLoading.value = false;
    }
  };

  const toggleFavorite = async (product: any) => {
    if (!token.value) {
      // Option: Redirect to login or show toast
      alert('Silakan login untuk menyimpan favorit');
      return;
    }

    try {
      const response = await $fetch<any>(`${apiUrl}/favorites/${product.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });

      if (response.favorited) {
        // Added to favorites
        if (!favorites.value.some(p => p.id === product.id)) {
          favorites.value.push(product);
        }
      } else {
        // Removed from favorites
        favorites.value = favorites.value.filter(p => p.id !== product.id);
      }
      return response.favorited;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      throw err;
    }
  };

  return {
    favorites,
    isLoading,
    error,
    isFavorited,
    fetchFavorites,
    toggleFavorite
  };
};
