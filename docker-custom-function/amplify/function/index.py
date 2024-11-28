def handler(event, context):
    # Extract content from event arguments
    content = event.get('arguments', {}).get('content', '')
    
    # Create response with proper structure
    response = {
        'statusCode': 200,
        'body': {
            'content': content
        }
    }
    
    return response