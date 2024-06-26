# Social Media System [Alpha]

A robust and scalable social media system, designed using Node.js. Powered by JavaScript, MongoDB, and Mongoose, it provides a solid foundation for creating users and allowing users to create channels and playlists, like videos, subscribe to channels, and view analytics on their dashboard. The codebase is tested and readable.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Routes](#auth-routes)
  - [Channel Routes](#channel-routes)
  - [Video Routes](#video-routes)
  - [Subscription Routes](#subscription-routes)
  - [Playlist Routes](#playlist-routes)
  - [Comment Routes](#comment-routes)
  - [Like Routes](#like-routes)
  - [Dashboard Routes](#dashboard-routes)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Create, read, update, and delete user accounts.
- **Channel Management**: Users can create and manage their own channels.
- **Playlist Management**: Create and manage playlists.
- **Like and Subscribe**: Users can like videos and subscribe to channels.
- **Analytics**: View channel and video analytics on the dashboard.
- **Scalability**: Designed to handle a large number of users and channels.
- **Testing**: Comprehensive tests for ensuring the reliability of the codebase.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ijwole/Alpha.git
   cd ALPHA_BACKEND

2. **Install dependencies**
    npm install

3. **Setup environments**
   - PORT=3000
   - MONGO_URI=your-mongo-url
   - JWT_SECRET=your-jwt-secret
   - ACCESS_TOKEN_SECRET=your-access-token-secret
   - ACCESS_TOKEN_EXPIRY=your-token-expiry-key
   - REFRESH_TOKEN_SECRET=your-refresh-token-secret
   - REFRESH_TOKEN_EXPIRY=your-refresh-expiry-ekey
   - CLOUD_NAME=your-cloudinary-name
   - CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   - CLOUDINARY_API_KEY=your-cloudinary-api-key

4. **Start the Server**
    npm run start (to start with node)
    npm run dev (to start with nodemon)

5. **Usage**
    Once the server is running, you can interact with the API using a tool like Postman or through your front-end application.

6. **API ENDPOINTS**
## User Routes
- Create User: POST /api/users
 (Creates a new user.)

- Get User: GET /api/users/:userId
    (Retrieves a user by their ID.)

- Update User: PUT /api/users/:userId
    (Updates a user by their ID.)

- Delete User: DELETE /api/users/:userId
    (Deletes a user by their ID.)

## Channel Routes
- Create Channel: POST /api/channels
   ( Creates a new channel.)

- Get Channel: GET /api/channels/:channelId
   ( Retrieves a channel by its ID.)

- Update Channel: PUT /api/channels/:channelId
    (Updates a channel by its ID.)

- Delete Channel: DELETE /api/channels/:channelId
    (Deletes a channel by its ID.)

- Get Channel Stats: GET /api/channels/:channelId/stats
    (Retrieves statistics for a channel by its ID.)

- Get Channel Videos: GET /api/channels/:channelId/videos
    (Retrieves videos for a channel by its ID.)

## Video Routes
- Create Video: POST /api/videos
    (Creates a new video.)

- Get Video: GET /api/videos/:videoId
   ( Retrieves a video by its ID.)

- Publish Video: PATCH /api/videos/toggle/publish/:videoId
   ( Updates a video by its ID.)

- Delete Video: DELETE /api/videos/:videoId
    (Deletes a video by its ID.)

- Like Video: POST /api/videos/:videoId/like
    (Likes a video by its ID.)

## Subscription Routes
- Subscribe to Channel: POST /api/subscriptions
   ( Subscribes to a channel.)

- Unsubscribe from Channel: DELETE /api/subscriptions/:subscriptionId
    (Unsubscribes from a channel by its subscription ID.)

- Get Subscriptions: GET /api/subscriptions?userId=your_user_id
   ( Retrieves subscriptions for a user by their user ID.)

## Playlist Routes

- Create Playlist: POST /api/playlists/create
   ( Creates a new playlist.)

- Get User Playlists: GET /api/playlists
    (Retrieves all playlists for a user.)

- Get Playlist By ID: GET /api/playlists/:playlistId
   ( Retrieves a playlist by its ID.)

- Add Video to Playlist: POST /api/playlists/:playlistId/add-video
   ( Adds a video to a playlist.)

- Remove Videos from Playlist: DELETE /api/playlists/:playlistId/delete-videos
    (Removes videos from a playlist.)

- Update Playlist: PUT /api/playlists/:playlistId/update
    (Updates a playlist by its ID.)

- Delete Playlist: DELETE /api/playlists/:playlistId/delete
    (Deletes a playlist by its ID.)

## Comment Routes

- Add Comment: PUT /api/comments/add
   ( Adds a new comment.)

- Update Comment: PATCH /api/comments/update
    (Updates a comment.)

- Delete Comment: DELETE /api/comments/delete
    (Deletes a comment.)

- Get All Comments: GET /api/comments
    (Retrieves all comments.)

## Like Routes

- Toggle Like Video: POST /api/likes/:videoId
   (Toggles the like status for a video by its ID.)

- Toggle Like Comment: POST /api/likes/:commentId
    (Toggles the like status for a comment by its ID.)

- Get All Liked Videos: POST /api/likes/videos
    (Retrieves all liked videos.)

## Dashboard Routes

- Get Channel Stats: GET /api/dashboard/channels/:channelId/stats
    (Retrieves statistics for a channel by its ID.)

- Get Channel Videos: GET /api/dashboard/channels/:channelId/videos
    (Retrieves videos for a channel by its ID.)

## Contributing
We welcome contributions to the project. To contribute, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bugfix.
- Make your changes and commit them with clear messages.
- Push your changes to your forked repository.
- Create a pull request to the main repository.
- *Please ensure that your code follows the project's coding standards and includes appropriate tests.*

## License
This project is licensed under the MIT License. See the LICENSE file for details.