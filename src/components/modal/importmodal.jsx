import React from "react";
import Modal from "./modal";
import CodeMirror from "../codemirror";
import {
  botMessageSchema,
  registerKeywords,
  stringifyErrors,
  webhookMessageSchema,
} from "../../validation";
import { extractRGB } from "../../color";
import Ajv from "ajv";

const ajv = registerKeywords(new Ajv({ allErrors: true }));
const validators = {
  regular: ajv.compile(botMessageSchema),
  webhook: ajv.compile(webhookMessageSchema),
};

const initialContent =
  "this `supports` __a__ **subset** *of* ~~markdown~~ 😃 ```js\nfunction foo(bar) {\n  console.log(bar);\n}\n\nfoo(1);```";
const initialColor = Math.floor(Math.random() * 0xffffff);
const initialEmbed = {
  title: "title ~~(did you know you can have markdown here too?)~~",
  description:
    "this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown. ```\nyes, even code blocks```",
  url: "https://discordapp.com",
  color: initialColor,
  timestamp: new Date().toISOString(),
  footer: {
    icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
    text: "footer text",
  },
  thumbnail: { url: "https://cdn.discordapp.com/embed/avatars/0.png" },
  image: { url: "https://cdn.discordapp.com/embed/avatars/0.png" },
  author: {
    name: "author name",
    url: "https://discordapp.com",
    icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
  },
  fields: [
    { name: "🤔", value: "some of these properties have certain limits..." },
    { name: "😱", value: "try exceeding some of them!" },
    {
      name: "🙄",
      value:
        "an informative error should show up, and this view will remain as-is until all issues are fixed",
    },
    {
      name: "<:thonkang:219069250692841473>",
      value: "these last two",
      inline: true,
    },
    {
      name: "<:thonkang:219069250692841473>",
      value: "are inline fields",
      inline: true,
    },
  ],
};

const initialCode = JSON.stringify(
  {
    content: initialContent,
    embed: initialEmbed,
  },
  null,
  "  "
);

const ImportModal = function (props) {
  return (
    <Modal
      title="Import"
      minWidth="90ch"
      maxWidth="90ch"
      maxHeight="90%"
      {...props}
    >
      <div
        className={
          "vh-100 h-auto-l w-100 w-100-l " +
          (props.darkTheme ? "bg-discord-dark" : "bg-discord-light")
        }
      >
        <Inner
          darkTheme={props.darkTheme}
          data={props.data}
          setData={props.setData}
          webhookMode={props.webhookMode}
          close={props.close}
        />
      </div>
    </Modal>
  );
};

const ErrorHeader = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <header className="f6 bg-red br2 pa2 br--top w-100 code pre-wrap">
      {error}
    </header>
  );
};

class Inner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: initialCode,
      webhookMode: props.webhookMode,
      data: {},
    };
  }

  componentDidMount() {
    this.validateInput(this.state.input, this.state.webhookMode);
  }

  validateInput(input, webhookMode) {
    const validator = webhookMode ? validators.webhook : validators.regular;

    let parsed;
    let isValid = false;
    let error = "";

    try {
      parsed = JSON.parse(input);
      isValid = validator(parsed);
      if (!isValid) {
        error = stringifyErrors(parsed, validator.errors);
      }
    } catch (e) {
      error = e.message;
    }

    let data = isValid ? parsed : this.state.data;

    // we set all these here to avoid some re-renders.
    // maybe it's okay (and if we ever want to
    // debounce validation, we need to take some of these out)
    // but for now that's what we do.
    this.setState({ input, data, error });
  }

  onCodeChange = (value, change) => {
    // for some reason this fires without the value changing...?
    if (value !== this.state.input) {
      this.validateInput(value, this.state.webhookMode);
    }
  };

  render() {
    return (
      <div style={{ height: "100%" }}>
        <ErrorHeader error={this.state.error} />
        <div style={{ overflowY: "auto", height: "65vh" }}>
          <CodeMirror
            onChange={this.onCodeChange}
            value={this.state.input}
            theme={this.props.darkTheme ? "one-dark" : "default"}
          />
        </div>

        <button
          onClick={() => {
            this.props.setData(this.state.data);
            this.props.close();
          }}
        >
          Import
        </button>
      </div>
    );
  }
}

function wrapper(props) {
  return <ImportModal {...props} />;
}

export default wrapper;
