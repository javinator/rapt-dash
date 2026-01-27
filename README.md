# RaptDash

A better dashboard for the Rapt Pill.
For the moment it only displays the values of the first pill hydrometer and the values of the active fermentation.

### RAPT API

The performance of the RAPT API is not really what it should be and the CORS header are not correctly set
(especially for OPTIONS requests). For use with Firefox a plugin like 'CORS Everywhere' is needed to function properly.

Here is the Swagger UI for the Rest API: [api.rapt.io](https://api.rapt.io/index.html)

Unfortunately, some of the endpoints which are not listed and would be needed for a fully functional app
are not callable (*403 Forbidden*), even with the paid subscription...
