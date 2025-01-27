import json
import requests
from requests_aws4auth import AWS4Auth
import boto3
import os

def handler(event, context):
    # AppSync API endpoint (should be set as environment variable)
    APPSYNC_API_ENDPOINT = os.environ.get('APPSYNC_API_ENDPOINT')
    region = os.environ.get('AWS_REGION')

    # GraphQL query
    query = """
    query ListTodos {
        listTodos {
            items {
                id
                content
            }
        }
    }
    """

    # Request payload
    payload = {
        'query': query,
        'variables': {}
    }

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
        
        return {
            'statusCode': 200,
            'body': json.dumps(data),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        
    except requests.exceptions.RequestException as e:
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