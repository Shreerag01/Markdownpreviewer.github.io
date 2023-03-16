const initialState = {
    text: `# Welcome to my Markdown Previewer!

This is a paragraph

# Heading 1
## Heading 2
### Heading 3

- List item 1
- List item 2
- List item 3

[Github](https://github.com/Shreerag01/Markdownpreviewer.github.io)
`
};


marked.setOptions({
    breaks: true
});

const renderer = new marked.Renderer();

function App(){

    const [editor, setText] = React.useState(initialState.text);
    const [html, setHTML] = React.useState("");
    const [preview, setPreview] = React.useState("");

    function copyCodeToClipboard(id){
        const el = document.getElementById(id);
        const text = (id === "editor") ? el.value : el.innerText;
        navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Copied to clipboard!');
        })
        .catch((error) => {
            console.error('Error copying to clipboard:', error);
        });
    }

    function pasteCodeFromClipboard(){
        navigator.clipboard.readText()
        .then((text) => {
            document.getElementById("editor").value += text;
        })
        .catch((error) => {
            console.error('Error pasting from clipboard:', error);
        });
    }

    function updateHTML(markdown){
        const html = marked(markdown);
        const escapedHTML = html.replace(/[<>&]/g, (tag) => ({
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
        }[tag]));
        const lines = escapedHTML.split('\n');
        const htmlWithBreaks = lines.map(line => line + '<br><br>').join('');
        setHTML(htmlWithBreaks);
    }

    React.useEffect(() => {
        updateHTML(editor);
        setPreview(marked(editor, { renderer: renderer }));
    }, [editor]);

    return(
        <div className="container"> 
            <div className="text-center mt-5">
                <h1 className="heading">Markdown Previewer</h1>
                <div className="row">
                    <div className="col-4 mt-5">
                        <h3 className="sub-heading">Editor</h3>
                        <textarea className="form-control" id="editor" value={editor} onChange={(e) => setText(e.target.value)} style={{maxHeight: '600px', overflowWrap: 'break-word'}}/>
                        <div className="Div">
                            <button className="btn mt-3" onClick={pasteCodeFromClipboard}><i className="fas fa-clipboard"></i> Paste Code</button>
                            <span style={{padding: '0 5px'}}></span>
                            <button className="btn mt-3" onClick={() => copyCodeToClipboard("editor")}><i className="fas fa-copy"></i> Copy Code</button>
                        </div>
                    </div>

                    <div className="col-4 mt-5">
                        <h3 className="sub-heading">Preview</h3>
                        <div className="preview" id="preview" style={{ overflowY: 'auto', maxHeight: '600px', overflowWrap: 'break-word'}} dangerouslySetInnerHTML={{__html: preview}}/>
                            <button className="btn mt-3" onClick={() => copyCodeToClipboard("preview")}><i className="fas fa-copy"></i> Copy Code</button>
                    </div>
                    

                    <div className="col-4 mt-5">
                        <h3 className="sub-heading">Html</h3>
                        <div className="html" id="html" style={{ overflowY: 'auto', maxHeight: '600px', overflowWrap: 'break-word'}} dangerouslySetInnerHTML={{__html: html}}/>
                            <button className="btn mt-3" onClick={() => copyCodeToClipboard("html")}><i className="fas fa-copy"></i> Copy Code</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));