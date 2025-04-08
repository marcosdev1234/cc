import axios from 'axios';

const api = axios.create({
  baseURL: 'https://superb-nougat-b106c5.netlify.app/.netlify/functions/api/api',
});

export async function createToken(formData) {
  try {
    console.log('En api.js - Tipo de formData:', formData instanceof FormData ? 'FormData' : typeof formData);
    console.log('Enviando FormData al backend:');
    if (formData instanceof FormData) {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
    } else {
      console.log('formData no es un FormData:', formData);
    }

    const response = await api.post('/create-token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en la llamada al backend:', error);
    throw error;
  }
}