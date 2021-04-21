import React from "react";
import Modal from "./modal";
import SimpleMarkdown from "simple-markdown";

import logo from "../../images/logo.png";
const GITHUB_REPO = "https://github.com/Vankka/embed-visualizer";

const aboutText = `
This embed visualizer is powered by open source software ❤

----------------------------------------------------------------

The source code for it is available at [GitHub](${GITHUB_REPO}) under the MIT license.

This tool is not officially part of [Discord][discordapp] or its [documentation][discord-docs].
It makes use of some assets derived/extracted from their application. This is
done for the sake of more helpful visuals, and not to infringe on their copyright.

### Thanks to

#### embed-visualizer creator and contributors

- [leoveol](https://github.com/leovoel/embed-visualizer) (Originally)
- [liz3](https://github.com/liz3/embed-visualizer) (Fork with improvements)

#### Libraries

- [React](https://facebook.github.io/react/)
- [Fontawesome](https://fontawesome.com/)
- [highlight.js](https://highlightjs.org)
- [simple-markdown](https://github.com/Khan/simple-markdown)
- [Twemoji](https://github.com/twitter/twemoji)
- [Tachyons](https://tachyons.io)

[discordapp]: https://discord.com/
[discord-docs]: https://discord.com/developers/docs/intro
`;
// #### TODO: Extra libraries for standalone
//
// - [Ajv](https://epoberezkin.github.io/ajv/)
// - [CodeMirror](https://codemirror.net)

const rules = {
  ...SimpleMarkdown.defaultRules,

  center: {
    // really naive but we'll be ok
    match: SimpleMarkdown.blockRegex(/^-= (.*?) =-/),
    order: SimpleMarkdown.defaultRules.paragraph.order,

    parse(capture, recurseParse, state) {
      return {
        content: SimpleMarkdown.parseInline(recurseParse, capture[1], state),
      };
    },

    react(node, recurseOutput, state) {
      return (
        <div key={state.key} className="db b f3 mv2 tc">
          {recurseOutput(node.content, state)}
        </div>
      );
    },
  },

  paragraph: {
    ...SimpleMarkdown.defaultRules.paragraph,
    react(node, recurseOutput, state) {
      return <p key={state.key}>{recurseOutput(node.content, state)}</p>;
    },
  },

  link: {
    ...SimpleMarkdown.defaultRules.link,
    react(node, recurseOutput, state) {
      return (
        <a
          className="link blurple underline-hover"
          href={SimpleMarkdown.sanitizeUrl(node.target)}
          title={node.title}
          key={state.key}
          target="_blank"
        >
          {recurseOutput(node.content, state)}
        </a>
      );
    },
  },

  list: {
    ...SimpleMarkdown.defaultRules.list,
    react(node, recurseOutput, state) {
      return React.createElement(node.ordered ? "ol" : "ul", {
        start: node.start,
        key: state.key,
        className: "mb4 pl4",
        children: node.items.map((item, i) => {
          return <li key={i}>{recurseOutput(item, state)}</li>;
        }),
      });
    },
  },

  hr: {
    ...SimpleMarkdown.defaultRules.hr,
    react(node, recurseOutput, state) {
      return <hr className="b--solid b--light-gray ma0" key={state.key} />;
    },
  },
};

const parser = SimpleMarkdown.parserFor(rules);
const renderer = SimpleMarkdown.reactFor(
  SimpleMarkdown.ruleOutput(rules, "react")
);

const renderAboutText = (input) => {
  input += "\n\n";
  return renderer(parser(input, { inline: false }));
};

const AboutModal = (props) => {
  return (
    <Modal title="About" maxWidth="80ch" maxHeight="90%" {...props}>
      <div className="ma3 nested-copy-seperator nested-copy-line-height">
        <div className="center w3">
          <a href={GITHUB_REPO} title="Embed Visualizer" target="_blank">
            <img src={logo} alt="Embed Visualizer" />
          </a>
        </div>
        {renderAboutText(aboutText)}
      </div>
    </Modal>
  );
};

export default AboutModal;
