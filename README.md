# Scrum Team

## Product Owner
- JT Madden

## Scrum Master
- Zahra Masroor

## Developers
- Matt Calvello
- Shreeya Karnam
- Veena Karnati

# Team 4 Photoshare App

## How to develop locally
### Tools needed
- Node.js
- MongoDB

### Installation
```
npm install
npm run build:w
node loadDatabase.js
nodemon
```

## Features of the App
### Login/Register page - ```/login-register```
- Register
  - When entering the app, you are prompted a registration page. Registration is required to access the app.
  - Credentials required: login name, password, first name, last name
  - Optional credentials: location, description, occupation
- Log in
  - Once you are registered, you can log in using your login name and password
### User Detail Page - ```/users/:userId```
- View user's details and photos
  - Locate the user list on the left side of the page. User list has list of current users in the app. Clicking on a user will give you user:
    - First Name
    - Last Name
    - Location
    - Description
    - Occupation
    - Most recent photo with date
    - Photo with most comments
    - Photos they've been mentioned in
- Delete your own user
  - To delete your account, locate your name in the user lists. This will take you to your user detail page. At the bottom of the page is a delete button. It will delete your user account.
### User Photo Page - ```/photos/:userId```
- Add your photos
  - On the top nav bar, click on "Add Photo" button. You can select which photo to upload. After uploading, photo appears in your user photo page.
- Remove your photos
  - Locate the user list on the left side of the app. Click on your own user name. The page will then show your user detail. Click on the "User Photos".
  - If you uploaded an image, a "Delete Button" is there. Click on this button to delete your photo. 
- View other user's photos
  - Locate the user list on the left side of the page. User list has list of current users in the app. Click on a user. It will then show user details. Click on "User Photos". Page will then show:
    - Photos
      - Time of photo posted
      - User's photos
    - Comments under photos
      - Comment data
      - User who commented
      - Comment
- Add comments
  - Under user's photos, you can add comments on them by clicking the "Add Comment" button. You will get a pop up to enter your comment. You have the option to cancel or add your comment. After added, comment will appear under photo with the date and user posted.
- Delete your comments
  - If you added a comment, there will be a "Delete Comment" button. It will delete your comment.
- @mention in comments
  - When you create a comment, you can @ existing users. After posting the comment, the thumbnail of photo will appear in that user's detail.
### Activity Feed Page - ```/activityFeed```
- View app's 5 most recent activity
  - 
### Other features
- Logout

## Technologies used
- Node.js - Running server 
- Mongoose - Schemas for MongoDB 
- MongoDB - Database for user info 
- React 
- Material-UI 
- HTML/CSS/JavaScript



