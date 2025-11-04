## Initial prompt

I need to create a layer that acts as a proxy between my web/mobile app and a salesforce backend.
This layer should handle authentication, data transformation, and caching to improve performance.

This layer should expose api endpoints such as
- POST /cart/items
- GET /cart
- DELETE /cart/items/:id

The POST endpoint should verify that the data received is valid, then transform the data to match salesforce data structure.

The GET /cart/:id should fetch the cart data from salesforce and return it in a format that is suitable for the web/mobile app.

The DELETE /cart/items/:id should delete the specified item from the cart in salesforce.

Can you provide a detailed plan for implementing such a layer using Node 20 and typescript?



## prompt 2
No need to add the monitoring for now, just trying to setup and be up and running quickly. Can you provide the minimal setup for the cart routes, the middleware to check the auth, the expressjs setup with routes exposure and also the adequate package.json

