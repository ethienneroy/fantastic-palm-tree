## Prompt

This layer should expose api endpoints such as
- POST /cart/items
- GET /cart
- DELETE /cart/items/:id

The POST endpoint should verify that the data received is valid, then transform the data to match salesforce data structure.

The GET /cart/:id should fetch the cart data from salesforce and return it in a format that is suitable for the web/mobile app.

The DELETE /cart/items/:id should delete the specified item from the cart in salesforce.