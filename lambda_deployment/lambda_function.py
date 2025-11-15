import json
import os
import requests

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") # Store your API Key securely in Lambda Environment Variables
GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" # Or your specific Gemini endpoint

def lambda_handler(event, context):
    if not GEMINI_API_KEY:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Gemini API Key not configured.'})
        }

    try:
        # The actual request body will be in event['body'] for POST requests
        request_payload = json.loads(event['body'])
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        # Make the request to Gemini API
        # You might need to adjust the endpoint and query parameters based on your specific Gemini API call
        gemini_url = f"{GEMINI_API_ENDPOINT}?key={GEMINI_API_KEY}"
        response = requests.post(gemini_url, headers=headers, json=request_payload)
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)

        return {
            'statusCode': response.status_code,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps(response.json())
        }

    except requests.exceptions.RequestException as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Error calling Gemini API: {str(e)}'})
        }
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON in request body.'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'An unexpected error occurred: {str(e)}'})
        }
