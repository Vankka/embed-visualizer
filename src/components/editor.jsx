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
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import DiscordView from "./discordview";
import AboutModal from "./modal/aboutmodal";
import CustomModal from "./modal/custommodal";
import { ENTER, ESC } from "./modal/modalcontainer";
import { SketchPicker } from "react-color";

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
          type="text"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: value,
            borderBottom: "solid 1px gray",
            width: "100%",
          }}
          ref={(input) => {
            if (props.autofocus && input !== null) {
              input.focus();
            }
          }}
          {...props}
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
          style={{
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "solid 1px gray",
            color: value,
            resize: "vertical",
            width: "100%",
          }}
          {...props}
        />
      )}
    </InputTextColorContext.Consumer>
  );
}

const Editor = class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      temporaryValue: "",
    };
  }

  render() {
    const editorDarkTheme = this.props.editorDarkTheme;
    const darkTheme = this.props.darkTheme;
    const compactMode = this.props.compactMode;

    let data = this.props.data;

    let embeds = data.embeds;
    if (embeds === undefined || embeds === null || embeds.length === 0) {
      let embed = data.embed;
      if (embed !== undefined && embed) {
        embeds = [embed];
      } else {
        embeds = [{}];
      }
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
                defaultValue={data.content}
                maxLength={2000}
                onChange={(event) => {
                  data.content = event.target.value;
                  this.props.setData(data);
                }}
              />

              {embeds.map((embed) => {
                let thisIndex = index++;
                if (embeds.length === 1) {
                }
                let author = embed.author === undefined ? {} : embed.author;
                let image = embed.image === undefined ? {} : embed.image;
                let thumbnail =
                  embed.thumbnail === undefined ? {} : embed.thumbnail;
                return (
                  <div key={thisIndex}>
                    <h3>
                      Embed {embeds.length === 1 ? "" : "#" + (thisIndex + 1)}
                    </h3>
                    <table>
                      <thead />
                      <tbody>
                        <tr>
                          <td>
                            <label htmlFor="titletext">Title</label>
                          </td>
                          <td style={{ width: "100%" }}>
                            <TextInput
                              id="titletext"
                              defaultValue={embed.title}
                              maxLength="256"
                              onChange={(event) => {
                                embed.title = event.target.value;
                                data.embeds[thisIndex] = embed;
                                this.props.setData(data);
                              }}
                            />
                          </td>
                          <td>
                            <IconButton
                              click={() => {
                                this.props.setModal(CustomModal, {
                                  exitButtons: [ESC, ENTER],
                                  title: "Set the Title URL",
                                  children: () => (
                                    <TextInput
                                      autoFocus={true}
                                      defaultValue={embed.url}
                                      maxLength="2000"
                                      onChange={(event) => {
                                        data.embeds[thisIndex]["url"] =
                                          event.target.value;
                                        this.props.setData(data);
                                      }}
                                    />
                                  ),
                                });
                              }}
                              icon={faLink}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="authorname">Author</label>
                          </td>
                          <td>
                            <TextInput
                              id="authorname"
                              maxLength="256"
                              defaultValue={author.name}
                              onChange={(event) => {
                                author.name = event.target.value;
                                data.embeds[thisIndex]["author"] = author;
                                this.props.setData(data);
                              }}
                            />
                          </td>
                          <td style={{ display: "flex", marginBottom: "10px" }}>
                            <IconButton
                              click={() => {
                                this.props.setModal(CustomModal, {
                                  exitButtons: [ESC, ENTER],
                                  title: "Set the Author URL",
                                  children: () => (
                                    <TextInput
                                      autoFocus={true}
                                      defaultValue={author.url}
                                      maxLength="2000"
                                      onChange={(event) => {
                                        author.url = event.target.value;
                                        data.embeds[thisIndex][
                                          "author"
                                        ] = author;
                                        this.props.setData(data);
                                      }}
                                    />
                                  ),
                                });
                              }}
                              icon={faLink}
                            />
                            <IconButton
                              click={() => {
                                this.props.setModal(CustomModal, {
                                  exitButtons: [ESC, ENTER],
                                  title: "Set the Author Icon URL",
                                  children: () => (
                                    <TextInput
                                      autoFocus={true}
                                      defaultValue={author.icon_url}
                                      maxLength="2000"
                                      onChange={(event) => {
                                        author.icon_url = event.target.value;
                                        data.embeds[thisIndex][
                                          "author"
                                        ] = author;
                                        this.props.setData(data);
                                      }}
                                    />
                                  ),
                                });
                              }}
                              icon={faImage}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="description">Description</label>
                          </td>
                          <td>
                            <ParagraphInput
                              id="description"
                              defaultValue={embed.description}
                              maxLength={2048}
                              onChange={(event) => {
                                data.embeds[thisIndex]["description"] =
                                  event.target.value;
                                this.props.setData(data);
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: "center" }}>
                            <label style={{ margin: 0 }}>Image URL</label>
                          </td>
                          <td>
                            <IconButton
                              click={() => {
                                this.props.setModal(CustomModal, {
                                  exitButtons: [ESC, ENTER],
                                  title: "Set the embed Image URL",
                                  children: () => (
                                    <TextInput
                                      autofocus={true}
                                      defaultValue={image.url}
                                      maxLength="2000"
                                      onChange={(event) => {
                                        image.url = event.target.value;
                                        data.embeds[thisIndex]["image"] = image;
                                        this.props.setData(data);
                                      }}
                                    />
                                  ),
                                });
                              }}
                              icon={faImage}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label>Thumbnail URL</label>
                          </td>
                          <td>
                            <IconButton
                              click={() => {
                                this.props.setModal(CustomModal, {
                                  exitButtons: [ESC, ENTER],
                                  title: "Set the embed Thumbnail URL",
                                  children: () => (
                                    <TextInput
                                      autofocus={true}
                                      defaultValue={thumbnail.url}
                                      maxLength="2000"
                                      onChange={(event) => {
                                        image.url = event.target.value;
                                        data.embeds[thisIndex][
                                          "thumbnail"
                                        ] = image;
                                        this.props.setData(data);
                                      }}
                                    />
                                  ),
                                });
                              }}
                              icon={faImage}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label>Color</label>
                          </td>
                          <td>
                            <IconButton
                              click={() => {
                                this.props.setModal(CustomModal, {
                                  exitButtons: [ESC, ENTER],
                                  title: "Set the embed Color",
                                  children: () => (
                                    <SketchPicker
                                      color={embed.color}
                                      onChange={(color) => {
                                        data.embeds[thisIndex]["color"] =
                                          color.rgb;
                                        this.props.setData(data);
                                      }}
                                      disableAlpha={true}
                                    />
                                  ),
                                });
                              }}
                              icon={faPalette}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="timestamp">Timestamp</label>
                          </td>
                          <td style={{ width: "100%" }}>
                            <TextInput
                              id="timestamp"
                              defaultValue={embed.timestamp}
                              onChange={(event) => {
                                data.embeds[thisIndex]["timestamp"] =
                                  event.target.value;
                                this.props.setData(data);
                              }}
                            />
                          </td>
                        </tr>
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
