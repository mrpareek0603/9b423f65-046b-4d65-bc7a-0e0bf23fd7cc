# Request Response Flow ->
    ### MVC
    - request come to server
    - goes to route, and redirected to controller
    - controller takes care of recieving the request, then validates and calls the service and sends response
    - service holds the business logic and processing, here dat fetched from repository layer gets processed and mapped
    - repository is responsible to communicate with the csv file and get data from it

    ### folders/file
    -   .env contains the port number to run server
    -   /src/data contains the cs vfiles
    -   /src/utils/csvLoader.js contains the utility function to load the csv file

# Steps to run
    - npm install
    - npm start