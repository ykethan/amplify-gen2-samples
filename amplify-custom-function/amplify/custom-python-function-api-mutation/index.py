import json
import requests
from requests_aws4auth import AWS4Auth
import boto3
import os

def handler(event, context):
    # AppSync API endpoint (should be set as environment variable)
    APPSYNC_API_ENDPOINT = os.environ.get('APPSYNC_API_ENDPOINT')
    region = os.environ.get('AWS_REGION')

    # Log the incoming event for debugging
    print("Received event:", json.dumps(event))

    # Get the product details from the event
    try:
        # Try to get the body if it exists, otherwise use the event directly
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            body = event
            
        print("Parsed body:", json.dumps(body))
        
        # Check if input is directly in the body or nested
        product_input = body.get('input', {})
        if not product_input and isinstance(body, dict):
            # If no 'input' key, try using the body directly
            product_input = body
            
        print("Product input:", json.dumps(product_input))
        
        # Validate required fields
        required_fields = ['Name', 'Prefix', 'SearchName']
        missing_fields = [field for field in required_fields if field not in product_input]
        if missing_fields:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': f'Missing required fields: {", ".join(missing_fields)}'
                }),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
    except json.JSONDecodeError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({
                'error': f'Invalid JSON in request body: {str(e)}'
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }

    # GraphQL mutation
    mutation = """
    mutation CreateProducts($input: CreateProductsInput!) {
        createProducts(input: $input) {
            Name
            Prefix
            SearchName
            createdAt
            id
            updatedAt
            __typename
        }
    }
    """

    # Request payload
    payload = {
        'query': mutation,
        'variables': {
            'input': product_input
        }
    }

    print("Sending payload to AppSync:", json.dumps(payload))

    # For IAM authentication
    credentials = boto3.Session().get_credentials()
    auth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        region,
        'appsync',
        session_token=credentials.token
    )

    try:
        # Make the request to AppSync
        response = requests.post(
            APPSYNC_API_ENDPOINT,
            json=payload,
            auth=auth,
            headers={'Content-Type': 'application/json'}
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Parse the response
        data = response.json()
        print("AppSync response:", json.dumps(data))
        
        return {
            'statusCode': 200,
            'body': json.dumps(data),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        
    except requests.exceptions.RequestException as e:
        print("Error making request:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }