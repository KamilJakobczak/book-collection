import GetBookList from './script/componenets/GetBookList';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import AddBook from './script/componenets/AddBook';

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) =>
      alert(`Graphql error ${message}`)
    );
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: 'http://localhost:4000/graphql' }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <header className='App-header'>
          <h1>Jamar's Book Collection</h1>
          <GetBookList />
          <AddBook />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
