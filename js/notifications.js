function requestNotificationPermission() {
    Notification.requestPermission().then((response) => {
        console.log(response);
    });
}

function createNotification(insult) {
    const icon = 'images/icons/shakespeare-apple-touch-icon.png';
    const play = insult.play;

    const notification = new Notification('New insult', { body: play, icon: icon });

    notification.addEventListener('click', (event) => {
        window.open('https://localhost:8000/');
    });
}

export { requestNotificationPermission, createNotification }