import "babel-polyfill";
import main from './main';

document.addEventListener('DOMContentLoaded', main);
//
// // request permission on page load
// document.addEventListener('DOMContentLoaded', function() {
// //   if (!Notification) {
// //     alert('Desktop notifications not available in your browser. Try Chromium.');
// //     return;
// //   }
// //
// //   if (Notification.permission !== 'granted')
// //     Notification.requestPermission();
//   navigator.serviceWorker.register('/sw.js');
//
//   Notification.requestPermission(function(result) {
//     if (result === 'granted') {
//       navigator.serviceWorker.ready.then(function(registration) {
//         registration.showNotification('Notification with ServiceWorker');
//       });
//     }
//   });
// });
// //
// //
// // function notifyMe() {
// //   debugger;
// //   if (Notification.permission !== 'granted')
// //     Notification.requestPermission();
// //   else {
// //     var notification = new Notification('Notification title', {
// //       icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
// //       body: 'Hey there! You\'ve been notified!',
// //     });
// //     notification.onclick = function() {
// //       window.open('http://stackoverflow.com/a/13328397/1269037');
// //     };
// //   }
// // }
// //
// // const btn = document.getElementById('btn');
// // debugger;
// // btn.addEventListener('click', () => notifyMe());
