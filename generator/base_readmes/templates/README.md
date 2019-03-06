# <%= blueprint.label %>
## Built with the [MEVN]() stack - [MongoDB](), [Express](), [Vue]() & [Node]()

## Table of Contents
- [Overview]()
- [Developer ]()
- [Setting up MongoDB]()
- [License]()

## Overview

Built with the [MEVN]() stack - [MongoDB](), [Express](), [Vue]() & [Node]()

## Developer Setup

### Prequisites

You will need the following on your local computer to develop:

- Node.js 8.x.x
- npm 3.x

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

You can verify the versions of these dependencies with the fowlloing commands:

```
npm --version
node --version
```

### Setting Up MongoDB

- Try [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for small projects - the free tier provides sufficient storage for

- Use [Docker Compose]() with the included `docker-compose.yml` file


### Express.js API Server

All the API server code lives in the `/server` directory


### Vue.js Web Client

All the web client code lives in the `/client` directory

## License

All code is licensed under the [MIT License](https://opensource.org/licenses/MIT). Built with [Codotype.io](https://codotype.io).

---


## Development

> NOTE: This project relies on Yarn as an alternative to NPM. To install Yarn, follow [these instructions](https://yarnpkg.com/lang/en/docs/install).

To start your development server:

```bash
yarn dev
```

Once it's started, you'll see a local URL you can use to access it (by default, `http://localhost:8080` if it's available). Note that all routes starting with `/api/` are automatically proxied to your backend server.

## Deployment

### Using [Now](https://zeit.co/now)

```bash
now
```

### Using [Heroku](https://www.heroku.com/)

1.  Only the first time, to create your app:

    ```bash
    heroku create
    ```

1.  Push the Git branch you want to deploy to Heroku:

    ```bash
    git push heroku branch-to-deploy:master
    ```

### Manual deployment

During your build process, make sure to:

1.  Install dependencies, using the exact versions in your lockfile

    ```bash
    yarn install --frozen-lockfile
    ```

2.  Build the frontend

    ```bash
    yarn build
    ```

Then start your application with:

```bash
yarn start
```

By default, it will be available at `http://localhost:9090`, but the port can be configured with a `PORT` environment variable.