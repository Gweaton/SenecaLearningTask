# Seneca Learning Technical Task

## Problem Statement

A simple Node.js app that allows a user to persist single stat objects and aggregates all stats into a summary on fetch.

Required routes to implement can be found in `swagger_yml.yaml`.

## Assumptions

- The app has been configured to store stats for a specific user - this user is identified by their userId in the request header (which can be any string). In a real-life example, this would obviously relate to a real user stored in a database, and there would be tests to ensure the user exists.
- This is the same for the courseId - a user can submit a score for any courseId, but in a real app, this would be an existing courseId. I would like to create a Course model with each courseId and update it with the user scores, but as the Swagger file specifies a POST request, rather than a PUT, I have chosen to simply create a new Stat object each time, with the courseId saved on it. All stats with the requested courseId are aggregated to calculate totals for the requesting user.
- When calculating the average score for a particular user on a particular course, I have calculated it to the nearest 1 decimal place, as it seemed like the most user-friendly way to display a score.

## Instructions for use

- Clone this repo to your local machine: `git clone https://github.com/Gweaton/SenecaLearningTask.git`
- Create a file named `.env` at the root of the project containing URIs of two databases you own, following the example below:
    ```
    DEV_DATABASE_URI=mongodb://path_to_dev_database
    TEST_DATABASE_URI=mongodb://path_to_test_database
    ```

- Run `npm install` to install the required dependencies for the app.
- To start the server, run `npm start` from the root directory of the project.
- You will then be able to interact with the app in a number of ways (see below).

### Running tests

To run the tests, simply run `npm test` from the root of the project.

Note: every now and then there is some flakiness with these tests due to the async nature of fetching from the database. Running them multiple times gives you a correct result, but I would like to make them more rock-solid so they can be more trusted.


### Running from the command line

#### Persisting data:

- To store a stat for a particular courseId, send a POST request in the following format:

`curl -X POST "http://localhost:3000/courses/{courseId}" -H "accept: application/json" -H "User-Id: {userId}" -H "Content-Type: application/json" -d "{ \"total\": {number_of_points}, \"timeStudied\": {time_studied_in_seconds}}"`

e.g. `curl -X POST "http://localhost:3000/courses/maths" -H "accept: application/json" -H "User-Id: George" -H "Content-Type: application/json" -d "{ \"total\": 5, \"timeStudied\": 10}"`

Your stat will be stored in the database in the following format:

```
  "stat": {
    "__v": 0,
    "userId": "George",
    "courseId": "maths",
    "total": 5,
    "timeStudied": 10,
    "_id": "5a608b27a0f6002fcb9ddae4"
  }
```

#### Retrieving a summary

To retrieve summary information (average score for the requested courseId and total timeStudied) for a user, send a GET request in the following format:

`curl -X GET "http://localhost:3000/courses/{courseId}" -H "accept: application/json" -H "User-Id: {userId}"`

e.g. `curl -X GET "http://localhost:3000/courses/maths" -H "accept: application/json" -H "User-Id: George"`

You will receive a response in the following format:
```
{
  "averageScore": 0,
  "timeStudied": 0
}
```

### Using Postman

An easier way to interact with the app is using Postman (found here: https://www.getpostman.com/). It allows you easily send get and post requests by simply entering the urls above e.g.
  - GET: `localhost:3000/courses/maths`
  - POST: `localhost:3000/courses/maths`

You'll need to set a header of `User-Id` and (for POST requests, set the body of the request to include the `total` and `timeStudied` keys with their values).

### Using Swagger

The project can also be interacted with via the Swagger UI, and has been configured to do so using the npm `cors` package. This is a bit of a workaround to use a local file that involves hosting the `swagger_yml.yaml` file with `http-server`.

You'll need to clone the Swagger UI repo from `https://github.com/swagger-api/swagger-ui`.

- Copy `swagger-yml.yaml` from this repostory into the Swagger UI directory.
- From the Swagger UI directory, open dist/index.html
- From the command line, run `http-server --cors` (you may need to run `npm install -g http-server` to run this).
- Run `npm start` from the SenecaLearningTask directory in another command line window
- Paste `localhost:8080/swagger_yml.yaml` into the search bar in the open `index.html`.
- Follow the instructions on the Swagger UI page to interact with the app.
