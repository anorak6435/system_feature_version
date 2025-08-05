import { EditorView } from "@codemirror/view"
import { basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"


let view = new EditorView({
    parent: document.getElementById("editmirror"),
    extensions: [basicSetup,
        javascript({ typescript: true })
    ]
})

function switchLanguage(lang) {
    let langExtension;
    switch (lang) {
        case "js":
            langExtension = javascript();
            break;
        case "ts":
            langExtension = javascript({ typescript: true });
            break;
        case "py":
            langExtension = python();
            break;
        case "html":
            langExtension = html();
            break;
        default:
            langExtension = [];
    }

    let temp_contents = view.state.doc.toString();

    // clear the editor to create the new one.
    document.getElementById("editmirror").innerHTML = "";

    view = new EditorView({
        parent: document.getElementById("editmirror"),
        doc: temp_contents,
        extensions: [basicSetup,
            langExtension
        ]
    });
}

function createFeature() {
    console.log(`CREATE FEATURE!`)


    const feat_obj = {"name": document.getElementById("feature_name").innerText,"code": view.state.doc.toString(),"lang": document.getElementById("language").value, "is_active": true};
    console.log(feat_obj);

    const reqOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feat_obj)
    }
    console.log(reqOptions);

    fetch(`http://localhost:8081/feature/`, reqOptions)
        .then(res => res.json())
        .then(_ => {window.location.href = "/";}) // nicely redirect the user to the homepage after creating the feature.
        .catch(err => console.error(err));
}

document.getElementById("create_feature").onclick = function() {createFeature();  };


document.getElementById("language").addEventListener("change", (e) => {
    switchLanguage(e.target.value);
});