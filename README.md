# content-dashboard

a content dashboard which fetches data from the https://dummyjson.com API

## Install and Dependencies

- for vue cli: npm install -g @vue/cli
- use axios for api calls, chart.js vue-chartjs for visualization

## Loading indicator

- https://www.digitalocean.com/community/tutorials/add-loading-indicators-to-your-vuejs-application

## Goals and steps

### 1. communicate with the API

- axios handles the api call, postStore handles the fetching and saves the posts
- App calls the fetchPosts function
- Post.vue is the representation of a post with content, likes, dislikes and user id
- App displays the posts and attributes in a list

### 2. customize the view of the posts

### Thumbs up/down

- https://codepen.io/recodenow/pen/bqpzBE
