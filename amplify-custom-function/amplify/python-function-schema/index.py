import json
import requests
from requests_aws4auth import AWS4Auth
import boto3
import os
import pathlib

def read_query(query_name):
    # Get the path to the queries.graphql file in the same directory as the handler
    current_dir = os.path.dirname(os.path.abspath(__file__))
    query_file = os.path.join(current_dir, 'queries.graphql')
    
    try:
        with open(query_file, 'r') as f:
            content = f.read()
            
        # Simple parser to extract the named query
        queries = {}
        current_query = []
        current_name = None
        
        for line in content.split('\n'):
            if line.startswith('query '):
                if current_name:
                    queries[current_name] = '\n'.join(current_query)
                current_name = line.split('(')[0].split()[-1]
                current_query = [line]
            elif current_name:
                current_query.append(line)
                
        if current_name:
            queries[current_name] = '\n'.join(current_query)
            
        return queries.get(query_name)
    except FileNotFoundError:
        print(f"Could not find queries file at: {query_file}")
        raise

def handler(event, context):
    # AppSync API endpoint (should be set as environment variable)
    APPSYNC_API_ENDPOINT = os.environ.get('APPSYNC_API_ENDPOINT')
    region = os.environ.get('AWS_REGION')

    # Get the ListTodos query from the file
    query = read_query('ListTodos')
    
    # Request payload with variables
    payload = {
        'query': query,
        'variables': {
            'limit': 10,  # Example variable
            'nextToken': None
        }
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