import React from 'react';
import vebPyLogo from '../Assets/images/vebpy.png';
import {Controlled as CodeMirror} from 'react-codemirror2'
import ReactMarkdown from 'react-markdown'
import {Route, Redirect, Switch} from "react-router-dom";
import OutsideAlerter from './OutsideAlerter';
import client from '../js/client';
import helper from '../js/helpers'


import 'codemirror/mode/python/python';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
import '../Assets/css/console.css';
import 'codemirror/theme/3024-day.css'
import 'codemirror/theme/3024-night.css'

class Content extends React.Component {
    render() {
        return (
            <OutsideAlerter onOutSideClick={() => {
                this.props.onEditorClick(-1)
            }}>
                <div className="content">
                    {
                        this.props.editors.map((editor, index) => {
                            return (
                                <Editor
                                    key={index}
                                    text={editor.text}
                                    mode={editor.mode}
                                    show={editor.show}
                                    output={editor.mode === 'markdown' ?
                                        <ReactMarkdown source={editor.text}/> : editor.output}
                                    changeMode={(mode) => {
                                        this.props.onChangeMode(mode, index);
                                    }}
                                    changeText={(text) => {
                                        this.props.onChangeText(text, index);
                                    }}
                                    onMinusClick={() => {
                                        this.props.onRemoveEditor(index);
                                    }}
                                    onPlusClick={() => {
                                        this.props.onAddEditor(index);
                                    }}
                                    onPlayClick={() => {
                                        this.props.onPlayClick(index);
                                    }}
                                    onEditorClick={() => {
                                        this.props.onEditorClick(index);
                                    }}
                                />
                            )
                        })
                    }
                </div>
            </OutsideAlerter>
        );
    }
}

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.instance = null;
    }
    render() {
        return (
            <div
                className={"editor" + (this.props.mode === 'markdown' ? ' day' : ' night')}
                ref={node => this.node = node}
            >
                <div className={"code-block"}
                     style={{display: this.props.mode === 'markdown' ? (this.props.show ? null : "none") : null}}
                     onClick={() => {
                         this.props.onEditorClick()
                     }}>
                    <CodeMirror
                        className="code-mirror"
                        value={this.props.text}
                        options={{
                            mode: this.props.mode,
                            theme: this.props.mode === 'markdown' ? '3024-day' : '3024-night',
                            lineNumbers: true
                        }}
                        onBeforeChange={(editor, data, value) => {
                            this.props.changeText(value);
                        }}
                        editorDidMount={editor => { this.instance = editor }}
                        onChange={(editor, data, value) => {
                        }}
                    />
                </div>
                <div className="output-block"
                     style={{display: this.props.mode === 'markdown' ? (!this.props.show ? null : "none") : null}}
                     onDoubleClick={() => {
                         this.props.onEditorClick();
                     }}
                >
                    {this.props.mode === 'markdown' ? this.props.output : <pre>{this.props.output}</pre>}
                </div>
                <div className={"options-block"} style={{display: this.props.show ? "" : "none"}}>
                    <div className="item left">
                        <pre>
                            <b style={{color: "cadetblue"}}>Current Mode: </b>{this.props.mode}
                        </pre>
                    </div>
                    <div className="item">
                        <button
                            onClick={() => {
                                this.props.changeMode("python")
                            }}
                        >
                            python
                        </button>
                        <button
                            onClick={() => {
                                this.props.changeMode("markdown")
                            }}
                        >
                            markdown
                        </button>
                    </div>
                    <div className="item" style={{display: this.props.mode === 'markdown' ? "none" : null}}>
                        <button onClick={this.props.onPlayClick}><i className="fas fa-play"> </i></button>
                    </div>
                    <div className="item">
                        <button onClick={this.props.onMinusClick}><i className="fas fa-minus"> </i></button>
                    </div>
                    <div className="item">
                        <button onClick={this.props.onPlusClick}><i className="fas fa-plus"> </i></button>
                    </div>
                </div>
            </div>
        );
    }
}

const ConsoleBody = (props) => {
    return (
        <div className="body">
            <Content
                editors={props.editors}
                onChangeMode={props.onChangeMode}
                onChangeText={props.onChangeText}
                onRemoveEditor={props.onRemoveEditor}
                onAddEditor={props.onAddEditor}
                onPlayClick={props.onPlayClick}
                onEditorClick={props.onEditorClick}
            />
        </div>
    );
};

class Title extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            editing: false,
        }
    }

    componentDidMount() {
        this.setState({
            title: this.props.title,
        });
    }

    handleTitleClick() {
        this.setState({
            editing: true,
        })
    }

    handleTitleChange(e) {
        this.setState({
            title: e.target.value,
        })
    }

    handleTitleSubmit() {
        this.setState({
            title: this.state.title !== "" ? this.state.title : this.props.title,
            editing: false,
        });
        this.props.onTitleUpdate(this.state.title !== "" ? this.state.title : this.props.title);
    }

    render() {
        return (
            <div className="title-bar">
                {
                    !this.state.editing ?
                        <div className="title" onClick={() => {
                            this.handleTitleClick()
                        }}>
                            {this.state.title}
                        </div> :
                        <div className="input">
                            <form onSubmit={() => {
                                this.handleTitleSubmit()
                            }}>
                                <input type="text" value={this.state.title} onChange={(e) => {
                                    this.handleTitleChange(e)
                                }}/>
                                <input type="submit"/>
                            </form>
                        </div>
                }
            </div>
        );
    }
}

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    onUploadChange(e) {
        this.setState({
            open: false
        });
        let input = e.target;
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.props.onUploadClick(text);
        };
        reader.readAsText(input.files[0]);
    }

    render() {
        return (
            <div className="main-menu">
                <button onClick={this.props.onNewDocumentClick}><i className="fas fa-file-alt"> </i></button>
                <OutsideAlerter onOutSideClick={() => {
                    this.setState({
                        open: false
                    });
                }}>
                    {
                        this.state.open ?
                            <input type="file" onChange={(e) => {
                                this.onUploadChange(e)
                            }}/> : <button onClick={() => {
                                this.setState({
                                    open: true
                                });
                            }}><i className="fas fa-upload"> </i></button>
                    }
                </OutsideAlerter>
                <button onClick={this.props.onDownloadClick}><i className="fas fa-download"> </i></button>
                <button onClick={this.props.onLogoutClick}><i className="fas fa-sign-out-alt"> </i></button>
            </div>
        );
    }
}

const ConsoleHeader = (props) => {
    return (
        <div className="header">
            <div className="logo">
                <img src={vebPyLogo} alt="VebPyLogo"/>
            </div>
            <div className="nav-bar">
                <Title title={props.title} onTitleUpdate={props.onTitleUpdate}/>
                <MainMenu
                    onNewDocumentClick={props.onNewDocumentClick}
                    onUploadClick={props.onUploadClick}
                    onDownloadClick={props.onDownloadClick}
                    onLogoutClick={props.onLogoutClick}
                />
            </div>
        </div>
    );
};

class Console extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            title: "Untitled",
            editors: [{text: "", mode: "python", output: "", show: false}],
            errors: "",
        }
    }

    login() {
        client.login((data) => {
            console.log(data);
            try {
                let id = data.data.getKernelInstance.id;
                this.setState({
                    token: id,
                });
            } catch (e) {
                this.setState({
                    errors: data.errors.message,
                })
            }
        });

    }

    newDocument() {
        this.setState({
            editors: [{text: "", mode: "python", output: "", show: false}],
        });
    }

    upload(text) {
        try {
            let json = JSON.parse(text);
            if (json.file !== "vebpynb") {
                this.setState({
                    errors: "JSON File Format Not Supported",
                });
                return;
            }
            console.log(json);
            this.setState(json);
        } catch(e) {
            this.setState({
                errors: "File not Supported",
            });
        }
    }

    download() {
        let {token, errors, ...json} = this.state;
        json.file = "vebpynb";
        helper.exportToJsonFile(json, this.state.title);
    }

    logout() {
        client.logout((data) => {
            console.log(data.data.closeKernelInstance.output);
            this.setState({
                token: null,
                editors: [{text: "", mode: "python", output: "", show: false}],
            })
        }, {id: this.state.token});
    }

    titleUpdate(newTitle) {
        this.setState({
            title: newTitle
        });
    }

    changeMode(mode, index) {
        let editors = this.state.editors.slice();
        editors[index].mode = mode;
        this.setState({
            editors: editors
        })
    }

    changeText(text, index) {
        let editors = this.state.editors.slice();
        editors[index].text = text;
        this.setState({
            editors: editors
        })
    }

    removeEditor(index) {
        let editors = this.state.editors;
        if (editors.length <= 1) {
            editors = [{text: "", mode: "python", output: ""}]
        } else {
            editors = [...editors.slice(0, index), ...editors.slice(index + 1, editors.length)];
        }
        this.setState({
            editors: editors
        });
    }

    addEditor(index) {
        let editors = this.state.editors;
        editors = [...editors.slice(0, index + 1), {
            text: "",
            mode: "python",
            output: "",
        }, ...editors.slice(index + 1, editors.length)];
        this.setState({
            editors: editors
        });
    }

    execute(index) {
        let editors = this.state.editors.slice();
        let code = editors[index].text;
        // console.log(code);
        client.execute((data) => {
            console.log(data);
            try {
                editors[index].output = data.data.execute.python.result.output + data.data.execute.python.result.error;
                this.setState({
                    editors: editors,
                });
            } catch (e) {
                this.setState({
                    errors: data.errors,
                })
            }
        }, {id: this.state.token, code: code});
    }

    currentEditor(index) {
        let editors = this.state.editors.slice();
        for (let i = 0; i < editors.length; i++) {
            editors[i].show = false;
        }
        if (index !== -1) {
            editors[index].show = true;
        }
        this.setState({
            editors: editors,
        })
    }

    render() {
        return (
            <div className="console">
                <Switch>
                    <Route exact path="/" render={() => {
                        return (this.state.token ? <Redirect to="/vebpy"/> : <Redirect to="/login"/>)
                    }}/>
                    <PrivateRoute path="/vebpy" elsePath="/login" token={this.state.token} render={() => {
                        return (
                            <div>
                                <ConsoleHeader
                                    title={this.state.title}
                                    onTitleUpdate={(newTitle) => {
                                        this.titleUpdate(newTitle)
                                    }}
                                    onNewDocumentClick={() => {
                                        this.newDocument()
                                    }}
                                    onUploadClick={(text) => {
                                        this.upload(text);
                                    }}
                                    onDownloadClick={() => {
                                        this.download()
                                    }}
                                    onLogoutClick={() => {
                                        this.logout()
                                    }}
                                />
                                <ConsoleBody
                                    editors={this.state.editors}
                                    onChangeMode={(mode, index) => {
                                        this.changeMode(mode, index)
                                    }}
                                    onChangeText={(text, index) => {
                                        this.changeText(text, index)
                                    }}
                                    onRemoveEditor={(index) => {
                                        this.removeEditor(index)
                                    }}
                                    onAddEditor={(index) => {
                                        this.addEditor(index)
                                    }}
                                    onPlayClick={(index) => {
                                        this.execute(index);
                                    }}
                                    onEditorClick={(index) => {
                                        this.currentEditor(index);
                                    }}
                                />
                            </div>
                        );
                    }}/>
                    <PrivateRoute path="/login" token={!this.state.token} elsePath="/vebpy" render={() => {
                        return <Login onLogin={() => {
                            this.login()
                        }}/>
                    }}/>
                </Switch>
            </div>
        );
    }
}

class Login extends React.Component {
    render() {
        return (
            <div className="login">
                Please generate a token to access VebPy: &nbsp;
                <button onClick={this.props.onLogin}>Login</button>
            </div>
        );
    }
}

class PrivateRoute extends React.Component {
    render() {
        return (
            <Route exact={this.props.exact} path={this.props.path} render={() => {
                if (this.props.token) {
                    return this.props.render()
                }
                return <Redirect to={this.props.elsePath}/>
            }}/>
        );
    }
}

export default Console;
