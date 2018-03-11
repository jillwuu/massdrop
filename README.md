# Massdrop Coding Challenge
## Summary

A REST API for a job queue that fetches data from a URL and displays the status and result of the job.


## How To Run
To install dependencies:
```$ npm install ```

Make sure Redis is installed and running. 

To run server:
```$ npm start```

The server should start on port 8000. 

## API Endpoints
### POST /url
To create a job:

#### Sample Request 
```
$ curl -H "Content-Type: application/json" -X POST -d \ '{"url": "google.com"}' http://localhost:8000/url
```
#### Successful Response Example:
```
{
    "url": "http://google.com",
    "status": "not_completed",
    "data": "",
    "_id": "5aa596f30683b7067d882f2e"
}
```

### GET /fetch/:id
To check the status of a job:

#### Sample Request:
```
$ curl -H "Content-Type: application/json" -X GET http://localhost:8000/fetch/5aa596f30683b7067d882f2e
```
#### Successful Response Example:
```
{
    "_id": "5aa596f30683b7067d882f2e",
    "url": "http://google.com",
    "status": "completed",
    "data": <data>
}
```



