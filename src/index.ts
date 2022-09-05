import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";

ReactDOM.render(React.createElement(App), document.getElementById("root"));

export { default as App } from "./components/app";
export { default as Button } from "./components/button";
export { default as CodeMirror } from "./components/codemirror";
export { default as DiscordView } from "./components/discordview";
export { default as Editor } from "./components/editor";
export { default as Embed } from "./components/embed";
export { default as DiscordInvite } from "./components/invite";
