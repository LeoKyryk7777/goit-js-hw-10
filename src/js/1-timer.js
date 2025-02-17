import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dataInput = document.getElementById('datetime-picker');
const dataButton = document.querySelector('[data-start]');
const hoursEl = document.querySelector('[data-hours]');
const daysEl = document.querySelector('[data-days]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEL = document.querySelector('[data-seconds]');
let userSelectedDate = null;
let timerId = null;

dataButton.addEventListener('click', startTimer);

flatpickr(dataInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Please choose a date in the future',
        color: 'red',
        titleColor: 'white',
        messageColor: 'white',
        backgroundColor: 'red',
        close: false,
      });
    } else {
      userSelectedDate = selectedDates[0];
      dataButton.removeAttribute('disabled');
    }
  },
});

function startTimer() {
  timerId = setInterval(updateTimer, 1000);
  dataButton.setAttribute('disabled', true);
  dataInput.setAttribute('disabled', true);
}
function updateTimer() {
  const diff = userSelectedDate - new Date();
  const { days, hours, minutes, seconds } = convertMs(diff);
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEL.textContent = addLeadingZero(seconds);
  if (diff <= 1000) {
    clearInterval(timerId);
    dataInput.removeAttribute('disabled');
  }
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
