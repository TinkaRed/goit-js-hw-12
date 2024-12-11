import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

//3я фікса -  перенесено у глобальне+
const lightbox = new SimpleLightbox('.gallery__item', {
    captionsData: 'alt',
    captionDelay: 250,
});

export function renderGallery(images, gallery) {
    const markup = images
        .map(
            ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
                `<a class="gallery__item" href="${largeImageURL}">
                <div class="gallery__card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="gallery__info">
                    <p><b>Likes:</b> ${likes}</p>
                    <p><b>Views:</b> ${views}</p>
                    <p><b>Comments:</b> ${comments}</p>
                    <p><b>Downloads:</b> ${downloads}</p>
                    </div>
                </div>
                </a>`
        )
        .join('');

    gallery.insertAdjacentHTML('beforeend', markup);

    // оновлення галереї тут лишаєм де й було
    lightbox.refresh();
}

export function toggleLoader(show) {
    const loader = document.querySelector('.loader');
    loader.style.display = show ? 'block' : 'none';
}
