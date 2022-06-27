import React from "react";
import "./App.css";
import List from "./component/List";
import "@fontsource/water-brush"

function App() {

  const headerBackground: string = Math.floor(Math.random()*16777215).toString(16);
  const headerColor: string = Math.floor(Math.random()*16777215).toString(16);
  const style = {
    backgroundColor: "#" + headerBackground,
    color: "#" + headerColor
  }
  
  return (
    <div className="App">
      <header className="App-header" style={style}>
        <h1>Franz List</h1>
      </header>
      <List></List>
    </div>
  );
}

export default App;
