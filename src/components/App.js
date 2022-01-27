import React, { useState } from "react";
import TopBar from "./TopBar";

import { TOKEN_KEY } from "../constants";
import "../styles/App.css";
import Main from "./Main";

function App() {
  // isLoggedIn state - based on localStorage has token or not
  const [isLoggedIn, setIsLoggedIn] = useState(
      // 有token key就是true，没有token key就是false

      localStorage.getItem(TOKEN_KEY) ? true : false
  );

  const logout = () => {
    console.log("log out");
    // delete token from localStorage
    localStorage.removeItem(TOKEN_KEY);
    // set isLoggedIn status -> false
    setIsLoggedIn(false);
  };

  const loggedIn = (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  };
  return (
      <div className="App">
        <TopBar isLoggedIn={isLoggedIn} handleLogout={logout} />
        <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn} />
      </div>
  );
}

export default App;