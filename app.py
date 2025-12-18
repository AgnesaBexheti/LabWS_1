from flask import Flask
from flask_graphql import GraphQLView
from schema import schema

app = Flask(__name__)

# Add GraphQL endpoint
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  # Enable GraphiQL interface for testing
    )
)

@app.route('/')
def home():
    return '<h1>GraphQL API is running!</h1><p>Visit <a href="/graphql">/graphql</a> to use GraphiQL</p>'

if __name__ == '__main__':
    app.run(debug=True)