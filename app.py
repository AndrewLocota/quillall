from flask import Flask, request, jsonify, make_response, render_template
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from flask_cors import CORS, cross_origin
from concurrent.futures import ThreadPoolExecutor
import logging
import os

logging.basicConfig(filename='app.log', level=logging.INFO)

app = Flask(__name__)
CORS(app, resources={r"/api/summarize": {"origins": "http://127.0.0.1:5500"}})

openai_api_key = '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'  # Set the key directly here

class ParallelChain:
    def __init__(self, chains):
        self.chains = chains

    def run(self, inputs):
        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(chain.run, input) for chain, input in zip(self.chains, inputs)]
            outputs = [future.result() for future in futures]
        return outputs
    
@app.route('/')
def home():
    return render_template('about.html')

@app.route('/')
def quillall():
    return render_template('QuillAll.html')

@app.route('/api/summarize', methods=['POST', 'OPTIONS'])
def summarize():
    if request.method == 'OPTIONS':
        # Preflight request. Reply successfully:
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Content-Type', 'application/json')
        logging.info('Summarize function was called')
        logging.info('Received request: %s', request.json)
        return response, 200
    elif request.method == 'POST':
        data = request.get_json()
        article = data.get('article')
        demographics = data.get('demographics', [])
        logging.info(f'Received request data: {data}')  # Log the request data
        
        llm = OpenAI(temperature=0.25, openai_api_key=openai_api_key)
        
        template = """Given the following text, carefully rephrase it and pick the words to be more appealing and fitting for the specified audience. Do not change the informative content. Where the text contains quotes, repeat the text inside the quotes verbatim.

        Text: {text}
        Demographic: {demographic}

        Rewritten Text:"""
        prompt_template = PromptTemplate(input_variables=["text", "demographic"], template=template)

        # Create a chain for each demographic
        chains = []
        for demographic in demographics:
            chain = LLMChain(llm=llm, prompt=prompt_template)
            chains.append(chain)

        # This is the overall chain where we run these chains in parallel.
        overall_chain = ParallelChain(chains)

        # Run the overall chain
        inputs = [{"text": article, "demographic": demographic} for demographic in demographics]
        rewritten_texts = overall_chain.run(inputs)

        response = make_response(jsonify({'rewritten_texts': rewritten_texts}))
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    else:
        # Handle all other types of requests
        return make_response('Method not allowed', 405)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
