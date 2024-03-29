# HomeCare-Connect
A mobile application built using React Native, provide variety of functionalities such as publishing tasks, accepting tasks, and read or write the comments.

## Features

- **Authentication:** User sign-up and login functionality.
- **Three Navigators:** Drawer, Stack Navigator, BottonTab Navigator.
- **Four Collections:** One for user basic information and overall rating, one for published tasks, one for accepted tasks, and one for comments..


## Screenshots

(Screenshots placeholder)

## Contributions

- **Shuyao Yu (Susiee03 - iterator1):** Implemented overall 3 navigator structures and set up pages.
- **Haidong Xu (Haidong):** Worked on Published tasks and Accepted tasks collections.
- **Zeyuan Hu (iterator1-jeffrey):** Worked on Profile collection and Comments collection.

### Iteration 1

Developed core functionalities and established the project structure:

- **Firestore Collections Setup:**

  - `Published Tasks`: Stores published task details, including title, cost, etc.
  - `Accepted Tasks`: Stores user accepted tasks.
  - `Reviews`: Stores user reviews with tasks accepted by others and comments.
  - `Users`: Manages user profiles including username, email, profile photos, overall rating.

- **Navigation Setup:**
  - Implemented `BottomTabNavigator`, `DrawerNavigator`, and `StackNavigator` for intuitive navigation within the app.
