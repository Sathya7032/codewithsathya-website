import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import Updates from "./pages/Updates";
import SnippetsPage from "./pages/SnippetsPage";
import TechnologyDetail from "./pages/TechnologyDetail";
import TutorialsPage from "./pages/TutorialsPage";
import TutorialTopics from "./pages/TutorialTopics";
import TutorialPage from "./pages/TutorialPage";
import BlogViewPage from "./pages/BlogViewPage";
import GoogleLogin from "./login/GoogleLogin";
import Registration from "./login/Registration";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./auth/auth";
import ProfilePage from "./login/ProfilePage";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId="323681600583-h8ta18gvt22h51qq9i48tslhmt7hds5v.apps.googleusercontent.com">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<BlogPage />} path="/blogs" />
            <Route element={<Updates />} path="/tech-updates" />
            <Route element={<SnippetsPage />} path="/code-snippets" />
            <Route element={<TechnologyDetail />} path="/technologies/:slug" />
            <Route element={<TutorialsPage />} path="/tutorials" />
            <Route element={<TutorialTopics />} path="/topics/:slug" />
            <Route element={<TutorialPage />} path="/topic/:slug" />
            <Route element={<BlogViewPage />} path="/blog/:slug" />
            <Route element={<GoogleLogin />} path="/login" />
            <Route element={<Registration />} path="/register" />
            <Route element={<PrivateRoute />}>
              <Route element={<ProfilePage />} path="/profile" />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
