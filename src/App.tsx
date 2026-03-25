import { AuthProvider } from './AuthContext';
import { ChatProvider } from './ChatContext';
import { ChatUI } from './ChatUI';
import { Layout } from './Layout';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Layout>
          <ChatUI />
        </Layout>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
