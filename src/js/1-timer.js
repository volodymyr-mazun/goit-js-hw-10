
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputRef = document.getElementById('datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;                                       // Глобальна змінна вибранної дати 
let countdownInterval = null;
inputRef.disabled = false;                                         // Поле активне перед запуском
startBtn.disabled = true;                                          // Кнопка неактивна перед запуском

flatpickr(inputRef, {                                              // Ініціалізація flatpickr, виведення попередження, неможливість вибрати минулий час
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];                     // Масив обраних дат, вибір першої
        const now = new Date();

    if (selectedDate <= now) {
        iziToast.warning({
            message: "Please choose a date in the future",
            position: 'topCenter',
            timeout: 3000,
        });
        startBtn.disabled = true;
            userSelectedDate = null;
        } else {
            userSelectedDate = selectedDate;
            startBtn.disabled = false;
        }
    },
});

startBtn.addEventListener('click', () => {                          // Обробник кнопки, подія click
    if (!userSelectedDate) return;                                  // Перевірка на пусте поле

    startBtn.disabled = true;
    inputRef.disabled = true;

    countdownInterval = setInterval(() => {                         // Створення інтервалу кожну секунду
        const now = new Date();
        const deltaMs = userSelectedDate - now;

        if (deltaMs <= 0) {                                         // Інструкція по закінченню часу
            clearInterval(countdownInterval);                       // Видалення інтервалу
            updateTimerDisplay(0, 0, 0, 0);

        iziToast.success({                                          // Повідомлення по закінченню часу
            title: 'Done!',
            message: "Countdown finished!",
            position: 'topCenter'
        });

        inputRef.disabled = false;      
        startBtn.disabled = true;
            return;
        }

    const { days, hours, minutes, seconds } = convertMs(deltaMs);
    updateTimerDisplay(days, hours, minutes, seconds);
    }, 1000);
});

function convertMs(ms) {                                            // Конвертація мілісекунд у час
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {                                    // Функція, перетворення у двох значне число
    return String(value).padStart(2, '0');
}

function updateTimerDisplay(days, hours, minutes, seconds) {        // Функція, яка вносить значення в DOM-дерево
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
}