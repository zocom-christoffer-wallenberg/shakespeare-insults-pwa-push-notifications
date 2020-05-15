import { requestNotificationPermission, createNotification } from './notifications.js';
import push from './push-notifications.js';

const insultElem = document.querySelector('.insult');
const playElem = document.querySelector('.play');
let stream = {};

function showInsult(insultObj) {
	insultElem.innerHTML = insultObj.insult;
	playElem.innerHTML = ' - ' + insultObj.play;
}

async function getInsult() {
	const url = 'https://shakespeare-insults-generator.herokuapp.com/getInsult';

  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' ,  Accept: 'application/json'}});
  const data = await response.json();
  
  showInsult(data);
  createNotification(data);
}

document.addEventListener('touchstart', event => {
  setTimeout(() => {
      if (document.querySelector('body').scrollTop < 0) {
          getInsult();
      }
  }, 1000);
})

getInsult();

function randomiseHue(videoElem) {
  let i = 0;
  let interval = setInterval(() => {
    let number = Math.floor(Math.random() * 360);
    let number2 = Math.floor(Math.random() * 10);
      videoElem.style.filter = `hue-rotate(${number}deg) blur(${number2}px)`;
      i++;
      if (i == 10) {
        clearInterval(interval);
      }
  }, 2000);
}

async function captureImage(stream) {
  const mediaTrack = stream.getVideoTracks()[0];
  console.log(mediaTrack);
  const captureImg = new ImageCapture(mediaTrack);
  const photo = await captureImg.takePhoto()
  console.log(photo)
  const imgUrl = URL.createObjectURL(photo);
  console.log(imgUrl);
  document.querySelector('#photo').src = imgUrl;
}


async function getMedia() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElem = document.querySelector('#me');
    videoElem.srcObject = stream;
    videoElem.addEventListener('loadedmetadata', () => {
      videoElem.play();
      randomiseHue(videoElem);
    })
    console.log(stream);
  } catch (error) {
      console.log(error);
  }
}

getMedia();

document.querySelector('#addImage').addEventListener('click', event => {
    //document.querySelector('.shakespeare').classList.toggle('hide');
    captureImage(stream);
})

function registrateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
    .then((registration) => { 
      console.log('Registered service worker')
      push();
    })
    .catch(error => console.log('Error with register service worker'));
  }
}

registrateServiceWorker();
requestNotificationPermission();