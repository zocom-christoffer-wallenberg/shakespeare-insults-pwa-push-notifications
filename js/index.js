import { requestNotificationPermission, createNotification } from './notifications.js';
import push from './push-notifications.js';

const insultElem = document.querySelector('.insult');
const playElem = document.querySelector('.play');

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