import { ChatProvider } from './ChatContext';
import { ChatUI } from './ChatUI';
import { Layout } from './Layout';

function App() {
  return (
    <ChatProvider>
      <Layout>
        <ChatUI />
      </Layout>
    </ChatProvider>
  );
}

export default App;
