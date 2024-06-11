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
   git clone https://github.com/yourusername/social-media-system.git
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
