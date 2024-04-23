# HomeCare-Connect

Welcome to HomeCare. Our app is designed to help people find home care workers and opportunities by providing features such as posting tasks, receiving tasks, locating addresses using Google Maps, and receiving notifications of new comments.

## Group members:
Shuyao Yu, Haidong Xu, Zeyuan Hu

## Demo video link:
https://www.youtube.com/watch?v=JtMiKEZt0rA 

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
- **Camera use:** User can take a photo in Profile avatar and Posting comments.
- **Location use:** When user posting tasks, they can use Marker to play with interactive map decide the location.
- **Notification:** Local Notifications can be set by user, they can select time they'd like to receive the notification. Push Notification is applied when user receive a new comment.
- **External API use:** Weather API, user can receive their current location weather at HomePage.

## Screenshots
Solarized dark             |  Solarized Ocean
:-------------------------:|:-------------------------:
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/5257c35e-b554-423f-8be5-6fd1427f18c3) | ![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/62a32f82-2cce-4329-ba6e-3ae6121b3207)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/014284b4-8173-494e-ae6b-36aecff91bf0) ｜ ![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/45c79dde-da83-4651-b0af-c278fc3ddf16)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/4118fdae-f1ac-4b99-bf36-de95e55f47a8) ｜ ![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/eaa9e4ed-16ac-4304-8fe8-75b9c28837fe)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/87adcbd4-6eb8-453b-8177-3477d6fe8cd8) ｜ ![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/2467adaf-ace6-46ed-8daf-9f9d156a3ba4)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/0e4de20a-e483-4649-80c4-a5f4694712db)



## Contributions

- **Shuyao Yu :** Designed UI for Login and Signup page. refactor components for better reuse.
- **Haidong Xu :** Set up interative map. bug fixed from previous iteration.
- **Zeyuan Hu :** Set up Cameras in Profile and Review page. Implemented Push and Local notification.

