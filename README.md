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
    PORT=3000
    MONGO_URI=your-mongo-url
    JWT_SECRET=your-jwt-secret
    ACCESS_TOKEN_SECRET=your-access-token-secret
    ACCESS_TOKEN_EXPIRY=your-token-expiry-key
    REFRESH_TOKEN_SECRET=your-refresh-token-secret
    REFRESH_TOKEN_EXPIRY=your-refresh-expiry-ekey
    CLOUD_NAME=your-cloudinary-name
    CLOUDINARY_API_SECRET=your-cloudinary-api-secret
    CLOUDINARY_API_KEY=your-cloudinary-api-key

4. **Start the Server**
    npm run start (to start with node)
    npm run dev (to start with nodemon)

**User Routes**
- Create User: POST /api/users
- Creates a new user.

- Get User: GET /api/users/:userId
Retrieves a user by their ID.

- Update User: PUT /api/users/:userId
Updates a user by their ID.

- Delete User: DELETE /api/users/:userId
Deletes a user by their ID.

**Channel Routes**
- Create Channel: POST /api/channels
Creates a new channel.

- Get Channel: GET /api/channels/:channelId
Retrieves a channel by its ID.

- Update Channel: PUT /api/channels/:channelId
Updates a channel by its ID.

- Delete Channel: DELETE /api/channels/:channelId
Deletes a channel by its ID.

- Get Channel Stats: GET /api/channels/:channelId/stats
Retrieves statistics for a channel by its ID.

- Get Channel Videos: GET /api/channels/:channelId/videos
Retrieves videos for a channel by its ID.

**Video Routes**
-Create Video: POST /api/videos
Creates a new video.

-Get Video: GET /api/videos/:videoId
Retrieves a video by its ID.

-Publish Video: PATCH /api/videos/toggle/publish/:videoId
Updates a video by its ID.

-Delete Video: DELETE /api/videos/:videoId
Deletes a video by its ID.

-Like Video: POST /api/videos/:videoId/like
Likes a video by its ID.

**Subscription Routes**
- Subscribe to Channel: POST /api/subscriptions
Subscribes to a channel.

- Unsubscribe from Channel: DELETE /api/subscriptions/:subscriptionId
Unsubscribes from a channel by its subscription ID.

- Get Subscriptions: GET /api/subscriptions?userId=your_user_id
Retrieves subscriptions for a user by their user ID.