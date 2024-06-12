from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import openai
import logging
from openai import OpenAI
client = OpenAI()

# Initialize logging
logging.basicConfig(filename='app.log', level=logging.INFO)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/update_content": {"origins": "http://localhost:3000"}})

# Set the OpenAI API key
openai.api_key = 'sk-proj-AuAhqSHJurbIUSHSErVbT3BlbkFJZHxmQppgUGwX7vFwku49'

@app.route('/api/update_content', methods=['POST', 'OPTIONS'])
def update_content():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Content-Type', 'application/json')
        return response, 200

    if request.method == 'POST':
        data = request.get_json()
        content = data.get('content')
        logging.info(f'Received request data: {data}')

        prompt = f"Received request data: {content}"
        logging.info(f'Generated prompt: {prompt}')

        try:
            response = client.chat,completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            logging.info(f'OpenAI API response: {response}')

            rewritten_text = response.choices[0].message['content'].strip()
            logging.info(f'Rewritten text: {rewritten_text}')

            response = make_response(jsonify({'rewritten_text': rewritten_text}))
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            return response

        except Exception as e:
            logging.error(f"General error: {str(e)}")
            return make_response(jsonify({'error': str(e)}), 500)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
