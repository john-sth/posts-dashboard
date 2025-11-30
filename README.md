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

- add visual representation of likes and dislikes
- separate main view in all posts and chart for displaying all posts

### 3. visualize which posts perform well

- for a quick and easy overview which posts perform well, 2 graphs have been added
- first graph displays in a bar chart the ratio of dislikes, likes and views for all posts
- second displays the total likes and dislikes for all tags

- https://codepen.io/recodenow/pen/bqpzBE
