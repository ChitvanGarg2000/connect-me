import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import withLoading from "./utils/withLoading.tsx";
import { Skeleton } from "antd";
import { getCookie } from "./utils/getCookie.ts";
import { PersistGate } from "redux-persist/integration/react";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const App = withLoading(() => import("./App.tsx"), <Skeleton />);
const SignUp = withLoading(() => import("./pages/SignUp.tsx"), <Skeleton />);
const Login = withLoading(() => import("./pages/Login.tsx"), <Skeleton />);
const Follow = withLoading(() => import("./pages/Follow.tsx"), <Skeleton />);
const AddPost = withLoading(() => import("./pages/AddPost.tsx"), <Skeleton />);
const MyPosts = withLoading(() => import("./pages/MyPosts.tsx"), <Skeleton />);

const httpLink = createHttpLink({
  uri: "https://connectme-obz8.onrender.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = getCookie("user_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
    resultCaching: false,
    possibleTypes: {},
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
    },
    mutate: {
      fetchPolicy: "no-cache",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <Router>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<App />} />
                <Route path="/followers" element={<Follow />} />
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/posts" element={<MyPosts />} />
              </Route>
            </Routes>
          </Router>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
