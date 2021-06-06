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
            minHeight: "2vw",
          }}
          {...props}
        />
      )}
    </InputTextColorContext.Consumer>
  );
}

const Editor = class extends React.Component {
  defaultState = {
    username: "Discord Bot",
    avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
  };

  constructor(props) {
    super(props);

    this.state = {
      showColorPicker: false,
      username: this.defaultState.username,
      avatar: this.defaultState.avatar,
    };
  }

  // helper method to clear empty javascript objects from a specified object
  clearObjectOfEmpty(object) {
    let properties = Object.keys(object);
    for (let propertyIndex in properties) {
      if (!properties.hasOwnProperty(propertyIndex)) {
        continue;
      }
      let property = properties[propertyIndex];

      let value = object[property];
      if (value === null || value.length === 0) {
        delete object[property];
      } else if (typeof value === "object") {
        this.clearObjectOfEmpty(value);
        if (value.length === undefined) {
          if (Object.keys(value).length === 0) {
            delete object[property];
          }
        } else if (value.length === 0) {
          delete object[property];
        }
      }
    }
  }

  render() {
    const editorDarkTheme = this.props.editorDarkTheme;
    const darkTheme = this.props.darkTheme;
    const compactMode = this.props.compactMode;
    const permitWebhookMode = this.props.permitWebhookMode;
    const webhookMode = permitWebhookMode && this.props.webhookMode;

    let data = this.props.data;

    let embeds = data.embeds;
    if (!webhookMode) {
      let embed = data.embed;
      if (embed !== null && embed !== undefined) {
        embeds = [embed];
      }
    }
    if (embeds === undefined || embeds === null || embeds.length === 0) {
      embeds = [{}];
    }

    const setData = (data) => this.props.setData(data);
    const setEmbeds = (embeds) => {
      for (let index in embeds) {
        if (!embeds.hasOwnProperty(index)) {
          continue;
        }
        let embed = embeds[index];

        this.clearObjectOfEmpty(embed);
        if (Object.keys(embed).length === 0) {
          delete embeds[index];
        } else {
          embeds[index] = embed;
        }
      }
      embeds = embeds.filter((embed) => embed !== null);

      if (webhookMode) {
        data.embeds = embeds;
      } else {
        data.embed = embeds[0];
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
              overflowY: "auto",
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
              {permitWebhookMode ? (
                <div className="editor-grid" style={{ marginTop: "10px" }}>
                  <h3 className="both">Webhook</h3>
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      let checked = event.target.checked;
                      if (!checked) {
                        let clearUsernameAndAvatar = () =>
                          this.setState(this.defaultState);
                        if (embeds.length > 1) {
                          event.preventDefault();
                          this.props.setModal(CustomModal, {
                            title: "Are you sure?",
                            children: () => {
                              return (
                                <div>
                                  <h4>
                                    Are you sure you would like to exit webhook
                                    mode?
                                  </h4>
                                  <p>
                                    All embeds besides the first embed will be
                                    removed, due to regular messages only
                                    supporting a single embed
                                  </p>
                                  <button
                                    onClick={() => {
                                      this.props.setWebhookMode(false);
                                      clearUsernameAndAvatar();
                                    }}
                                  >
                                    Exit Webhook Mode
                                  </button>
                                </div>
                              );
                            },
                          });
                          return;
                        }
                        clearUsernameAndAvatar();
                      }

                      this.props.setWebhookMode(checked);
                    }}
                    checked={webhookMode}
                  />
                  <label>Enable webhook mode</label>

                  {webhookMode ? (
                    <div className="both editor-grid">
                      <label>Webhook username</label>
                      <TextInput
                        onChange={(event) =>
                          this.setState({ username: event.target.value })
                        }
                        defaultValue={this.state.username}
                      />

                      <label>Webhook Avatar URL</label>
                      <IconButton
                        click={() => {
                          this.props.setModal(CustomModal, {
                            exitButtons: [ESC, ENTER],
                            title: "Set the webhook avatar URL",
                            children: () => (
                              <TextInput
                                autoFocus={true}
                                defaultValue={this.state.avatar}
                                maxLength="2000"
                                onChange={(event) =>
                                  this.setState({ avatar: event.target.value })
                                }
                              />
                            ),
                          });
                        }}
                        icon={faImage}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}

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
                let fields = embed.fields === undefined ? [] : embed.fields;

                let openFieldEditor = (existingField, index) => {
                  let newField = existingField === undefined;
                  let field = newField
                    ? { name: "", value: "", inline: true }
                    : existingField;

                  let updateFields = (field, click) => {
                    if (newField) {
                      if (!click) {
                        return;
                      }
                      fields.push(field);
                    } else {
                      fields[index] = field;
                    }
                    embeds[thisIndex]["fields"] = fields;
                    setEmbeds(embeds);
                  };

                  this.props.setModal(CustomModal, {
                    title: newField
                      ? "Create a field"
                      : "Alter field properties",
                    maxHeight: "90vh",
                    minWidth: "20em",
                    children: (props) => {
                      return (
                        <div className="fieldsgrid-modal">
                          <div>
                            <label>
                              Name
                              <TextInput
                                defaultValue={field.name}
                                maxLength="256"
                                onChange={(event) => {
                                  field.name = event.target.value;
                                  updateFields(field);
                                }}
                              />
                            </label>
                          </div>

                          <div>
                            <label>
                              Value
                              <ParagraphInput
                                defaultValue={field.value}
                                maxLength="2000"
                                onChange={(event) => {
                                  field.value = event.target.value;
                                  updateFields(field);
                                }}
                              />
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  field.inline = event.target.checked;
                                  updateFields(field);
                                }}
                              />
                              &nbsp;Inline
                            </label>
                            &nbsp;
                            {newField ? (
                              <button
                                onClick={() => {
                                  updateFields(field, true);
                                  props.close();
                                }}
                              >
                                Create
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  fields.splice(index, 1);
                                  embeds[thisIndex]["fields"] = fields;
                                  setEmbeds(embeds);
                                  props.close();
                                }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    },
                  });
                };

                return (
                  <div key={thisIndex} className="editor-grid">
                    <div>
                      <h3>Embed {webhookMode ? "#" + (thisIndex + 1) : ""}</h3>
                    </div>

                    <div className="modalsgrid" style={{ marginTop: "40px" }}>
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
                        href="#"
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
                        href="#"
                        onClick={() => {
                          this.props.setModal(CustomModal, {
                            exitButtons: [ESC, ENTER],
                            title: "Alter author properties",
                            children: () => {
                              return (
                                <div>
                                  <p>Icon URL</p>
                                  <TextInput
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

                    <div>
                      <span>Fields</span>
                    </div>
                    <div className="fieldsgrid">
                      {fields.map((field, index) => {
                        let fieldName = field.name;
                        if (fieldName.length > 10) {
                          fieldName = fieldName.substring(0, 10);
                        }
                        return (
                          <div key={index}>
                            <a
                              href="#"
                              onClick={() => openFieldEditor(field, index)}
                            >
                              {fieldName}
                            </a>
                          </div>
                        );
                      })}
                      <div>
                        <a href="#" onClick={() => openFieldEditor(undefined)}>
                          New
                        </a>
                      </div>
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
            avatar_url={this.state.avatar}
            username={this.state.username}
          />
        </div>
      </section>
    );
  }
};

export default Editor;
