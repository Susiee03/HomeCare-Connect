# HomeCare-Connect

Welcome to HomeCare. Our app is designed to help people find home care workers and opportunities by providing features such as posting tasks, receiving tasks, locating addresses using Google Maps, and receiving notifications of new comments.

## Prepare keys/id as below:

- apiKey
- authDomain
- projectId
- storageBucket
- messagingSenderId
- appId
- WEATHER_API_KEY

## rules

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /{document=\*\*} {
allow read, write: if request.auth != null;
}
}
}

## Features

- **Authentication:** User sign-up and login functionality.
- **Camera use:** User can take a photo in Profile avatar and Posting comment.
- **Location use:** When user posting tasks, they can use Marker to play with interactive map decide the location.
- **Notification:** Local Notifications can be set by user, they can select time they'd like to receive the notification. Push Notification is applied when user receive a new comment.
- **External API use:** Weather API, user can receive their current location weather at HomePage.

## Screenshots

![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/471d2bda-fdf9-4ae7-8275-db7ffb260945)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/b12f1eae-dd9d-4c96-b84e-5123fb8801c4)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/17d993bd-a1c4-4ba6-91ff-d8c21960b350)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/9ee5a775-a1c5-47de-912b-97c1f5e4f24f)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/ecb61da6-2dd9-44de-adfe-e8b84c6a3d23)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/63165123-91b1-403f-a4e5-cbe917ccc4ba)

## Contributions

- **Shuyao Yu :** Designed UI for Login and Signup page. refactor components for better reuse.
- **Haidong Xu :** Set up interative map. bug fixed from previous iteration.
- **Zeyuan Hu :** Set up Cameras in Profile and Review page. Implemented Push and Local notification.

### Iteration 3

- `External API`: Weather API
- `Camera use`: In profile, review page.
- `Location`: In Posting tasks and profile address, with Marker.
- `Authentication`: Signup and Login Page.
- `Notification`: local notification in Profile page and push notification in Review page.
