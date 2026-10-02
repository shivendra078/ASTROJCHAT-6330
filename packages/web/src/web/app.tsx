import { Route, Switch } from "wouter";
import Index from "./pages/index";
import { ChatPage, CallPage } from "./pages/consult";
import FreeKundliPage from "./pages/free-kundli";
import KundliResultPage, { SampleKundliPage } from "./pages/kundli-result";
import PanchangPage from "./pages/panchang";
import BlogPage from "./pages/blog";
import BlogPostPage from "./pages/blog-post";
import WalletPage from "./pages/wallet";
import WalletRechargePage from "./pages/wallet-recharge";
import AstrologerPage from "./pages/astrologer";
import { LoginModal } from "./components/account/login-modal";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/chat-with-astrologer" component={ChatPage} />
        <Route path="/talk-to-astrologer" component={CallPage} />
        <Route path="/free-kundli" component={FreeKundliPage} />
        <Route path="/free-kundli/:id" component={KundliResultPage} />
        <Route path="/freekundli" component={FreeKundliPage} />
        <Route path="/freekundli/basic-detail" component={SampleKundliPage} />
        <Route path="/panchang" component={PanchangPage} />
        <Route path="/panchang/today-panchang" component={PanchangPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/astrology-blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/my-wallet" component={WalletPage} />
        <Route path="/wallet-recharge" component={WalletRechargePage} />
        <Route path="/astrologer/:id" component={AstrologerPage} />
        <Route path="/best-astrologer/:id" component={AstrologerPage} />
      </Switch>
      <LoginModal />
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
