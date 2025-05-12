import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

const formData = new FormData(e.target);
const delay = Number(formData.get('delay'));
const state = formData.get('state');

const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (state === 'fulfilled') {
            resolve(delay);
        } else if (state === 'rejected') {
            reject(delay);
        }
    }, delay);
});

myPromise
    .then((delayValue) => {
        iziToast.success({
            title: '',
            message: `✅ Fulfilled promise in ${delayValue}ms`,
            position: 'topRight'
        });
    })
    .catch((delayValue) => {
        iziToast.error({
            title: '',
            message: `❌ Rejected promise in ${delayValue}ms`,
            position: 'topRight'
        });
    });
});