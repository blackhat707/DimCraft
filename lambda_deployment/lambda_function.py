import json
import os
import requests

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" # Or your specific Gemini endpoint
# Retrieve the allowed origin from environment variables
ALLOWED_ORIGIN = os.environ.get("GEMINI_PROXY_ALLOWED_ORIGIN", "*") # Use '*' as a fallback for development if not set

def lambda_handler(event, context):
    # Default headers for the response, including CORS
    response_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token', # Include headers your client might send
        'Access-Control-Allow-Methods': 'POST,OPTIONS' # Include allowed methods
    }

    if not GEMINI_API_KEY:
        return {
            'statusCode': 500,
            'headers': response_headers, # Include CORS headers even on error
            'body': json.dumps({'error': 'Gemini API Key not configured.'})
        }

    try:
        # Check if it's an OPTIONS preflight request (API Gateway usually handles this, but good to be explicit)
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': response_headers,
                'body': json.dumps({'message': 'CORS preflight successful'})
            }
            
        request_payload = json.loads(event['body'])
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        gemini_url = f"{GEMINI_API_ENDPOINT}?key={GEMINI_API_KEY}"
        response = requests.post(gemini_url, headers=headers, json=request_payload)
        response.raise_for_status()

        return {
            'statusCode': response.status_code,
            'headers': response_headers, # This is the key change!
            'body': json.dumps(response.json())
        }

    except requests.exceptions.RequestException as e:
        return {
            'statusCode': 500,
            'headers': response_headers, # Include CORS headers even on error
            'body': json.dumps({'error': f'Error calling Gemini API: {str(e)}'})
        }
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': response_headers, # Include CORS headers even on error
            'body': json.dumps({'error': 'Invalid JSON in request body.'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': response_headers, # Include CORS headers even on error
            'body': json.dumps({'error': f'An unexpected error occurred: {str(e)}'})
        }
