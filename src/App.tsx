import React from "react";
import "./App.css";
import List from "./component/List";
import "@fontsource/water-brush";

function App() {
  const headerBackground: string = Math.floor(
    Math.random() * 16777215
  ).toString(16);
  const headerColor: string = Math.floor(Math.random() * 16777215).toString(16);
  const style = {
    backgroundColor: "#" + headerBackground,
    color: "#" + headerColor,
  };

  const logo = process.env.PUBLIC_URL + "/github_logo.svg";
  const github_url = "https://github.com/vctls/franz_list/";

  const getItems = () => {
    const keys: string[] = Object.keys(localStorage);
    return keys.map((key: string) => {
      const id = parseInt(key);
      return {
        id,
        ...JSON.parse(localStorage.getItem(key) || ""),
      };
    });
  };
  
  const itemCreateHandler = (
    id: number,
    order: number,
    name: string,
    done: boolean
  ): void => {
    window.localStorage.setItem(
      String(id),
      JSON.stringify({ order, name, done })
    );
  };

  const itemUpdateHandler = (
    id: number,
    order: number,
    name: string,
    done: boolean
  ): void => {
    window.localStorage.setItem(
      String(id),
      JSON.stringify({ order, name, done })
    );
  };

  return (
    <div className="App">
      <header className="App-header" style={style}>
        <h1>Franz List</h1>
      </header>
      <List
        initialItems={getItems()}
        itemCreate={itemCreateHandler}
        itemUpdate={itemUpdateHandler}
        itemDelete={function (id: number): void {
          window.localStorage.removeItem(String(id));
        }}
      ></List>
      <footer>
        <img src={logo} alt="Github logo" height="16px"></img>{" "}
        <a href={github_url}>{github_url}</a>
      </footer>
    </div>
  );
}

export default App;
