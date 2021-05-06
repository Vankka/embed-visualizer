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
import { combineRGB } from "../color";

const InputTextColorContext = React.createContext("black");

import "../css/editor.css";

function IconButton(props) {
  return (
    <div onClick={() => props.click()}>
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
            if (props.autoFocus === true && input !== null) {
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
      showColorPicker: false,
    };
  }

  render() {
    const editorDarkTheme = this.props.editorDarkTheme;
    const darkTheme = this.props.darkTheme;
    const compactMode = this.props.compactMode;

    let data = this.props.data;

    let embeds = data.embeds;
    let singleEmbed = false;
    if (embeds === undefined || embeds === null || embeds.length === 0) {
      let embed = data.embed;
      if (embed !== undefined && embed) {
        singleEmbed = true;
        embeds = [embed];
      } else {
        embeds = [{}];
      }
    }

    const setData = (data) => this.props.setData(data);
    const setEmbeds = (embeds) => {
      if (singleEmbed || true) {
        // TODO: allow multiple embeds for webhook mode
        data.embed = embeds[0];
      } else {
        data.embeds = embeds;
      }
      setData(data);
    };

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
            <div className="toolbar">
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
                  setData(data);
                }}
              />

              {embeds.map((embed, thisIndex) => {
                let author = embed.author === undefined ? {} : embed.author;
                let image = embed.image === undefined ? {} : embed.image;
                let thumbnail =
                  embed.thumbnail === undefined ? {} : embed.thumbnail;
                return (
                  <div key={thisIndex} className="editor-embed">
                    <div className="both">
                      <h3>
                        Embed {embeds.length === 1 ? "" : "#" + (thisIndex + 1)}
                      </h3>
                    </div>

                    <div className="both subgrid">
                      <div>
                        <label style={{ margin: 0 }}>Image URL</label>
                        <IconButton
                          click={() => {
                            this.props.setModal(CustomModal, {
                              exitButtons: [ESC, ENTER],
                              title: "Set the embed Image URL",
                              children: () => (
                                <TextInput
                                  autoFocus={true}
                                  defaultValue={image.url}
                                  maxLength="2000"
                                  onChange={(event) => {
                                    image.url = event.target.value;
                                    embeds[thisIndex]["image"] = image;
                                    setEmbeds(embeds);
                                  }}
                                />
                              ),
                            });
                          }}
                          icon={faImage}
                        />
                      </div>
                      <div>
                        <label>Thumbnail URL</label>
                        <IconButton
                          click={() => {
                            this.props.setModal(CustomModal, {
                              exitButtons: [ESC, ENTER],
                              title: "Set the embed Thumbnail URL",
                              children: () => (
                                <TextInput
                                  autoFocus={true}
                                  defaultValue={thumbnail.url}
                                  maxLength="2000"
                                  onChange={(event) => {
                                    thumbnail.url = event.target.value;
                                    embeds[thisIndex]["thumbnail"] = thumbnail;
                                    setEmbeds(embeds);
                                  }}
                                />
                              ),
                            });
                          }}
                          icon={faImage}
                        />
                      </div>
                      <div style={{ position: "relative" }}>
                        <label>Color</label>
                        <IconButton
                          click={() =>
                            this.setState({
                              showColorPicker: !this.state.showColorPicker,
                            })
                          }
                          icon={faPalette}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "25px",
                            marginLeft: "-9em",
                            zIndex: "1",
                            display: this.state.showColorPicker
                              ? "block"
                              : "none",
                          }}
                        >
                          <SketchPicker
                            color={embed.color}
                            onChange={(color) => {
                              embeds[thisIndex]["color"] = combineRGB(
                                color.rgb
                              );
                              setEmbeds(embeds);
                            }}
                            disableAlpha={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <a
                        href=""
                        onClick={() => {
                          this.props.setModal(CustomModal, {
                            exitButtons: [ESC, ENTER],
                            title: "Set the Title URL",
                            children: () => (
                              <TextInput
                                autoFocus={true}
                                defaultValue={embed.url}
                                maxLength="2000"
                                onChange={(event) => {
                                  embeds[thisIndex]["url"] = event.target.value;
                                  setEmbeds(embeds);
                                }}
                              />
                            ),
                          });
                        }}
                      >
                        <label htmlFor="titletext">Title</label>
                      </a>
                    </div>
                    <div className="last2">
                      <TextInput
                        id="titletext"
                        defaultValue={embed.title}
                        maxLength="256"
                        onChange={(event) => {
                          embed.title = event.target.value;
                          embeds[thisIndex] = embed;
                          setEmbeds(embeds);
                        }}
                      />
                    </div>

                    <div>
                      <a
                        href=""
                        onClick={() => {
                          this.props.setModal(CustomModal, {
                            exitButtons: [ESC, ENTER],
                            title: "Alter author properties",
                            children: () => {
                              return (
                                <div>
                                  <p>Icon URL</p>
                                  <TextInput
                                    autoFocus={true}
                                    defaultValue={author.icon_url}
                                    maxLength="2000"
                                    onChange={(event) => {
                                      author.icon_url = event.target.value;
                                      embeds[thisIndex]["author"] = author;
                                      setEmbeds(embeds);
                                    }}
                                  />

                                  <p>URL</p>
                                  <TextInput
                                    defaultValue={author.url}
                                    maxLength="2000"
                                    onChange={(event) => {
                                      author.url = event.target.value;
                                      embeds[thisIndex]["author"] = author;
                                      setEmbeds(embeds);
                                    }}
                                  />
                                </div>
                              );
                            },
                          });
                        }}
                      >
                        <label htmlFor="authorname">Author</label>
                      </a>
                    </div>
                    <div>
                      <TextInput
                        id="authorname"
                        maxLength="256"
                        defaultValue={author.name}
                        onChange={(event) => {
                          author.name = event.target.value;
                          embeds[thisIndex]["author"] = author;
                          setEmbeds(embeds);
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="timestamp">Timestamp</label>
                    </div>
                    <div>
                      <TextInput
                        id="timestamp"
                        defaultValue={embed.timestamp}
                        onChange={(event) => {
                          embeds[thisIndex]["timestamp"] = event.target.value;
                          setEmbeds(embeds);
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="description">Description</label>
                    </div>
                    <div>
                      <ParagraphInput
                        id="description"
                        defaultValue={embed.description}
                        maxLength={2048}
                        onChange={(event) => {
                          embeds[thisIndex]["description"] = event.target.value;
                          setEmbeds(embeds);
                        }}
                      />
                    </div>
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
