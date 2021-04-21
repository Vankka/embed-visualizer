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
      data: {},
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
              editorDarkTheme={this.state.darkTheme}
              darkTheme={this.state.darkTheme}
              setDarkTheme={(value) => this.setState({ darkTheme: value })}
              compactMode={this.state.compactMode}
              setCompactMode={(value) => this.setState({ compactMode: value })}
              import={() => this.setState({ modal: ImportModal })}
              export={() => this.setState({ modal: ExportModal })}
              save={null}
              setModal={(modal) => this.setState({ modal: modal })}
            />

            <footer className="w-100 pa3 tc white" />
          </div>
        </main>

        <ModalContainer
          currentModal={this.state.modal}
          darkTheme={this.state.darkTheme}
          data={this.state.data}
          setData={(data) => this.setState({ data: data })}
          webhookMode={false}
          close={() => this.setState({ modal: null })}
        />
      </div>
    );
  }
};

export default App;
