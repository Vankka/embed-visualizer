import React from "react";

import Editor from "./editor";
import ModalContainer from "./modal/modalcontainer";
import ImportModal from "./modal/importmodal";
import ExportModal from "./modal/exportmodal";

import "../css/index.css";

const App = class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      darkTheme: true,
      compactMode: false,
      modal: null,
      modalProps: {},
      data: {},
      webhookMode: false,
    };
  }

  render() {
    return (
      <div>
        <main className="vh-100-l bg-blurple open-sans">
          <div className="h-100 flex flex-column">
            <Editor
              data={this.state.data}
              setData={(data) => this.setState({ data: data })}
              darkTheme={this.state.darkTheme}
              setDarkTheme={(value) => this.setState({ darkTheme: value })}
              compactMode={this.state.compactMode}
              setCompactMode={(value) => this.setState({ compactMode: value })}
              permitWebhookMode={true}
              webhookMode={this.state.webhookMode}
              setWebhookMode={(value) => this.setState({ webhookMode: value })}
              import={() =>
                this.setState({ modal: ImportModal, modalProps: [] })
              }
              export={() =>
                this.setState({ modal: ExportModal, modalProps: [] })
              }
              save={null}
              editorDarkTheme={this.state.darkTheme}
              setModal={(modal, props) =>
                this.setState({ modal: modal, modalProps: props })
              }
            />

            <footer className="w-100 pa3 tc white" />
          </div>
        </main>

        <ModalContainer
          currentModal={this.state.modal}
          close={() => this.setState({ modal: null })}
          darkTheme={this.state.darkTheme}
          data={this.state.data}
          setData={(data) => this.setState({ data: data })}
          {...this.state.modalProps}
        />
      </div>
    );
  }
};

export default App;
