import axios from 'axios';

const API_KEY = '47412942-a85f50e46f34315cc96f2bd1d';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1, perPage = 15) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    // 2га фікса - прибрати перевірку аксіос, додати трай/кетч+
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch images: ${error.message}`);
    }
}
