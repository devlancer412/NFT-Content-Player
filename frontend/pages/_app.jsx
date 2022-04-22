import "../styles/globals.css";
import { wrapper, store } from "../store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
  return (
    <Privider store={store}>
      <Component {...pageProps} />
    </Privider>
  );
}

export default wrapper.withRedux(MyApp);
