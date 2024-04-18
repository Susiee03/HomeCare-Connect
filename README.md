# HomeCare-Connect
A mobile application built using React Native, provide variety of functionalities such as publishing tasks, accepting tasks, and read or write the comments.

## .env
- apiKey= "AIzaSyDXnm9LIxa0-Vud-1M34kWwq4wGQVC_cTQ"
- authDomain= "finalproject-c4cbd.firebaseapp.com"
- projectId= "finalproject-c4cbd"
- storageBucket= "finalproject-c4cbd.appspot.com"
- messagingSenderId= "534098631112"
- appId= "1:534098631112:web:cbc3de827fc442091448fd"
- WEATHER_API_KEY = "5bd2e0405c5b05e7f1dcda04a58619b5"

## rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

## Features
- **Authentication:** User sign-up and login functionality.
- **Camera use:** User can add, update images in Profile.
- **Location use:** When user posting tasks, they can use Marker to select the location.
- **Notification:** Notifications can be set by user, they can select time they'd like to receive the notification.
- **External API use:** Weather API, user can receive their current location weather at HomePage.


## Screenshots
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/471d2bda-fdf9-4ae7-8275-db7ffb260945)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/b12f1eae-dd9d-4c96-b84e-5123fb8801c4)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/17d993bd-a1c4-4ba6-91ff-d8c21960b350)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/9ee5a775-a1c5-47de-912b-97c1f5e4f24f)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/ecb61da6-2dd9-44de-adfe-e8b84c6a3d23)
![image](https://github.com/Susiee03/HomeCare-Connect/assets/120871272/63165123-91b1-403f-a4e5-cbe917ccc4ba)



## Contributions

- **Shuyao Yu :** Implemented Authentication on Signup, Login Screen and External API.
- **Haidong Xu :** Implemented Locations in Posting Tasks.
- **Zeyuan Hu :** Implemented on Cameras in Profile and Notification.

### Iteration 2
- `External API`: Weather API
- `Camera use`: In profile, working on review pages.
- `Location`: In Posting tasks, with Marker.
- `Authentication`: Signup and Login Page.
- `Notification`: In Profile and Notification Page. 
