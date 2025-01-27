## Amplify Custom Function

Testing custom function that is used to call the AppSync API using Python as runtime.

### Non docker build

`custom-python-function-api` is the custom function that is used to call the AppSync API. used bundling to locally build the function and then deployed to AWS.


`python-function-schema` is the custom function that is used to call the AppSync API but the query is from the query.graphql file. used bundling to locally build the function and then deployed to AWS.

### Docker build

`custom-function-docker` is the custom function that is used to call the AppSync API. Uses docker to build the function and then deployed to AWS.

