import { fetchImages } from './js/pixabay-api.js';
import { renderGallery, toggleLoader } from './js/render-functions.js';
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";
// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('#search-input');
const loadMoreBtn = document.createElement('button');

let currentPage = 1;
const perPage = 15;
let currentQuery = '';
let totalHits = 0;

loadMoreBtn.textContent = 'Load more';
loadMoreBtn.classList.add('load-more');
loadMoreBtn.style.display = 'none';
document.body.appendChild(loadMoreBtn);

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = input.value.trim();

    if (!query) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query!',
            backgroundColor: '#EF4040',
            color: '#FAFAFB',
            position: "topRight"
        });
        return;
    }

    currentQuery = query;
    currentPage = 1;
    gallery.innerHTML = '';
    loadMoreBtn.style.display = 'none';

    try {
        toggleLoader(true);
        const { hits, totalHits: newTotalHits } = await fetchImages(query, currentPage, perPage);

        if (hits.length === 0) {
            iziToast.warning({
                title: 'No Results',
                message: 'Sorry, there are no images matching your search query. Please, try again!',
                backgroundColor: '#EF4040',
                color: '#FAFAFB',
                position: "topRight"
            });
        } else {
            totalHits = newTotalHits;
            renderGallery(hits, gallery);
            iziToast.success({
                title: 'Success',
                message: `Found ${totalHits} images!`,
                position: "topRight",
                color: '#FAFAFB'
            });
            //перша фікса - кнопку прибрати при малій кількості карток+
            if (hits.length === perPage) {
                loadMoreBtn.style.display = 'block';
            }
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: error.message,
            backgroundColor: '#EF4040',
            position: "topRight",
            color: '#FAFAFB'
        });
    } finally {
        toggleLoader(false);
        input.value = '';
    }
});

loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;

    const loader = document.querySelector('.loader');
    loader.style.display = 'block';
    loadMoreBtn.insertAdjacentElement('beforebegin', loader);

    try {
        const { hits } = await fetchImages(currentQuery, currentPage, perPage);

        renderGallery(hits, gallery);
        scrollPage();
        
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: error.message,
            backgroundColor: '#EF4040',
            position: "topRight",
            color: '#FAFAFB'
        });
    } finally {
        loader.style.display = 'none';
    }
});

function scrollPage() {
    const cardHeight = gallery.firstElementChild.getBoundingClientRect().height;
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}
