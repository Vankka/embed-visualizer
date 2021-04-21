import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faDownload,
  faImage,
  faLink,
  fas,
  faSave,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import DiscordView from "./discordview";
import AboutModal from "./modal/aboutmodal";

const InputTextColorContext = React.createContext("black");

function IconButton(props) {
  return (
    <div onClick={() => props.click()} style={{ marginRight: "10px" }}>
      <FontAwesomeIcon icon={props.icon} />
    </div>
  );
}

function TextInput(props) {
  return (
    <InputTextColorContext.Consumer>
      {(value) => (
        <input
          id={props.id}
          type="text"
          value={props.value}
          onChange={(event) => props.change(event.target.value)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: value,
            borderBottom: "solid 1px gray",
          }}
        />
      )}
    </InputTextColorContext.Consumer>
  );
}

function ParagraphInput(props) {
  return (
    <InputTextColorContext.Consumer>
      {(value) => (
        <textarea
          id={props.id}
          value={props.value}
          onChange={(event) => props.change(event.target.value)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "solid 1px gray",
            color: value,
            resize: "vertical",
          }}
        />
      )}
    </InputTextColorContext.Consumer>
  );
}

const Editor = class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const editorDarkTheme = this.props.editorDarkTheme;
    const darkTheme = this.props.darkTheme;
    const compactMode = this.props.compactMode;

    let data = this.props.data;

    let embeds = data.embeds;
    if (embeds === undefined || embeds === null || embeds.length === 0) {
      embeds = [{}];
      data.embeds = embeds;
    }
    let index = 0;

    return (
      <section className="flex-l flex-auto">
        <div className="vh-100 h-auto-l w-100 w-50-l pa4 pr3-l pb0-l">
          <div
            className={
              "w-100 h-100 br2 flex flex-column white overflow-hidden " +
              (editorDarkTheme ? "bg-discord-dark" : "bg-discord-light")
            }
            style={{
              padding: "10px",
              color: editorDarkTheme ? "white" : "black",
            }}
          >
            <div style={{ display: "flex", marginBottom: "10px" }}>
              {this.props.setDarkTheme != null ? (
                <IconButton
                  click={() => this.props.setDarkTheme(!darkTheme)}
                  icon={darkTheme ? fas.faSun : fas.faMoon}
                />
              ) : null}
              {this.props.setCompactMode != null ? (
                <IconButton
                  click={() => this.props.setCompactMode(!compactMode)}
                  icon={
                    compactMode
                      ? fas.faCompressArrowsAlt
                      : fas.faExpandArrowsAlt
                  }
                />
              ) : null}
              {this.props.import != null ? (
                <IconButton
                  click={() => this.props.import()}
                  icon={faDownload}
                />
              ) : null}
              {this.props.export != null ? (
                <IconButton click={() => this.props.export()} icon={faUpload} />
              ) : null}
              {this.props.save != null ? (
                <IconButton click={() => this.props.save()} icon={faSave} />
              ) : null}
              <IconButton
                click={() => this.props.setModal(AboutModal)}
                icon={faBook}
              />
            </div>

            <InputTextColorContext.Provider
              value={editorDarkTheme ? "white" : "black"}
            >
              <h3>Content</h3>
              <ParagraphInput
                id="messagecontent"
                value={data.content}
                change={(value) => {
                  data.content = value;
                  this.props.setData(data);
                }}
              />

              {embeds.map((embed) => {
                let thisIndex = index++;
                if (embeds.length === 1) {
                }
                return (
                  <div key={thisIndex}>
                    <h3></h3>
                    <table>
                      <thead />
                      <tbody>
                        <tr>
                          <td>
                            <label htmlFor="messagecontent">Content</label>
                          </td>
                          <td></td>
                          <td style={{ width: "100%" }} />
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="titletext">Title</label>
                          </td>
                          <td>
                            <TextInput
                              id="titletext"
                              value={embed.title}
                              change={(value) => {
                                embed.title = value;
                                data.embeds[thisIndex] = embed;
                                this.props.setData(data);
                              }}
                            />
                          </td>
                          <td>
                            <div
                              style={{ display: "flex", marginBottom: "10px" }}
                            >
                              <IconButton click={() => {}} icon={faLink} />
                              <IconButton click={() => {}} icon={faImage} />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="authortext">Author</label>&nbsp;
                          </td>
                          <td>
                            <TextInput id="authortext" change={(value) => {}} />
                          </td>
                          <td>
                            <IconButton click={() => {}} icon={faLink} />
                          </td>
                        </tr>
                        <tr></tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </InputTextColorContext.Provider>
          </div>
        </div>

        <div className="vh-100 h-auto-l w-100 w-50-l pa4 pl3-l pb0">
          <DiscordView
            darkTheme={darkTheme}
            compactMode={this.props.compactMode}
            data={this.props.data}
          />
        </div>
      </section>
    );
  }
};

export default Editor;
