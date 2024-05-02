const title = document.querySelector(".title");
const countdown = document.querySelector(".countdown");
const eventNameInput = document.querySelector("#event-name");
const eventDateInput = document.querySelector("#event-date");
const enableSoundCheckbox = document.querySelector("#enable-sound");

let interval,
  enableSound = false,
  delay = 3000;

//* event listeners

const setupEventListeners = () => {
  document.addEventListener("DOMContentLoaded", initCountdown);

  document.querySelector(".form").addEventListener("submit", handleSubmit);

  document.querySelector("#reset").addEventListener("click", handleReset);

  document.querySelector("#new").addEventListener("click", handleReset);
};

//* event handlers

const handleReset = () => {
  // stop the timer
  clearInterval(interval);
  title.textContent = "Countdown Timer";
  countdown.querySelector(".running").hidden = false;
  countdown.querySelector(".expired").hidden = true;
  countdown.hidden = true;
  updateCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // clear local storage
  localStorage.removeItem("countdownData");

  // reset form
  eventNameInput.value = "";
  eventDateInput.value = "";
  enableSoundCheckbox.checked = false;
};

const handleSubmit = (e) => {
  e.preventDefault();

  const eventDate = new Date(eventDateInput.value);

  // check for past dates
  if (getTimeLeft(eventDate) <= 0) {
    alert("Please choose future date");
    return;
  }

  // show countdown timer
  countdown.hidden = false;
  title.textContent = eventNameInput.value;
  enableSound = enableSoundCheckbox.checked;

  // save to local storage
  localStorage.setItem(
    "countdownData",
    JSON.stringify({
      eventName: eventNameInput.value,
      eventDate,
      enableSound,
    })
  );

  // run timer every second
  runCountdown(eventDate);

  interval = setInterval(() => runCountdown(eventDate), 1000);
};

//* countdown

const initCountdown = () => {
  const countdownData = JSON.parse(localStorage.getItem("countdownData"));

  if (!Object.is(countdownData, null)) {
    countdown.hidden = false;
    title.textContent = countdownData.eventName;
    enableSound = countdownData.enableSound;

    const eventDate = new Date(countdownData.eventDate);

    runCountdown(eventDate);

    interval = setInterval(() => runCountdown(eventDate), 1000);
  }
};

const runCountdown = (eventDate) => {
  const timeLeft = getTimeLeft(eventDate);

  if (timeLeft <= 0) {
    // stop timer
    clearInterval(interval);
    title.textContent = "Countdown Over";
    countdown.querySelector(".running").hidden = true;
    countdown.querySelector(".expired").hidden = false;

    handleSound(timeLeft);
  } else {
    const timeLeftDate = new Date(timeLeft);

    updateCountdown({
      days: timeLeftDate.getDate() - 1,
      hours: timeLeftDate.getHours() + timeLeftDate.getTimezoneOffset()/60,
      minutes: timeLeftDate.getMinutes(),
      seconds: timeLeftDate.getSeconds(),
    });
  }
};

const updateCountdown = ({ days, hours, minutes, seconds }) => {
  countdown.querySelector(".days").textContent = formatTime(days);
  countdown.querySelector(".hours").textContent = formatTime(hours);
  countdown.querySelector(".minutes").textContent = formatTime(minutes);
  countdown.querySelector(".seconds").textContent = formatTime(seconds);
};

//* helpers

const handleSound = (timeLeft) => {
  const isTimeout = timeLeft < -delay;
  if (enableSound && !isTimeout) {
    playSound();
  }
};

const playSound = () => {
  const sound = new Audio("./notification.mp3");
  sound.play();
};

const formatTime = (time) => {
  return time < 10 ? `0${time}` : time;
};

const getTimeLeft = (eventDate) => {
  return eventDate - new Date().getTime();
};

//* initialize

setupEventListeners();
