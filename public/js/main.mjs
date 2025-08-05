import {EditorView} from "@codemirror/view"
import {basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"

const view = new EditorView({
  doc: "Start document",
  parent: document.getElementById("editmirror"),
  extensions: [basicSetup,
    javascript({typescript: true})
  ]
})

// keep a global reference to the versions, features and systems that are loaded from the database.

let global_data_reference = { "features" : {} };


class Factory {
  build(element, values) {
    throw new Error(`Not Implemented the build function for the factory! for values: ${values} unto element: ${element}`);
  }
}


class ListFactory extends Factory {
  build(element, values) {
    
    let innerlist = values.map((val) => {return "<li>" + val.name + "</li>";})
    console.log(innerlist);
    element.innerHTML = "<ul>" + innerlist.join("") + "</ul>"
  }
}

class VersionFactory extends Factory {
  build(element, values) {
    
    let innerlist = values.map((val) => {return "<li>" + val.name + "</li>";})
    console.log(innerlist);
    element.innerHTML = "<ul>" + innerlist.join("") + "</ul>"
  }
}

function get_language(lang) {
  let langdict = {
    "js": javascript({typescript: true}),
    "py": python()
  }
  return langdict[lang];
}

function updateFeature(id) {
  console.log(`UPDATE FEATURE: ${id}`)


  const reqOptions = {
    method: "PUT",
    headers:  {"Content-Type": "application/json" },
    body: JSON.stringify({"code": global_data_reference['features'][id].state.doc.toString()})
  }
  console.log(reqOptions);

  fetch(`http://localhost:8081/feature/${id}`, reqOptions)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

function deleteFeature(id) {
  console.log(`DELETE FEATURE: ${id}`)


  const reqOptions = {
    method: "DELETE",
    headers:  {"Content-Type": "application/json" },
  }
  console.log(reqOptions);

  fetch(`http://localhost:8081/feature/${id}`, reqOptions)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

class FeatureFactory extends Factory {
  build(element, values) {
    
    let innerlist = values.map((val) => {return "<h3>" + val.name + "</h3>" + "<div id=\"" + val._id + "\"></div>" + "<button type=\"button\" class=\"btn btn-secondary\" id=\"update_" + val._id + "\">Update</button><button type=\"button\" class=\"btn btn-danger\" id=\"delete_" + val._id + "\">Delete</button>";})
    console.log(innerlist);
    element.innerHTML = "<div>" + innerlist.join("") + "</div>"

    // all id's are put into the html document.
    values.map((val) => {
      // create a editor view for every piece of code feature
      let codeView = new EditorView({
      doc: val.code,
      parent: document.getElementById(val._id),
      extensions: [basicSetup,
        get_language(val.lang)
      ]
    })
    // store it in the global reference for later use
    global_data_reference["features"][val._id] = codeView;
    console.log(global_data_reference);

    console.log(codeView.state.doc.toString());

    // join update functionality for the update buttons.

    document.getElementById("update_" + val._id).onclick = function() {updateFeature(val._id)};
    document.getElementById("delete_" + val._id).onclick = function() {deleteFeature(val._id)};

    })

  }
}


class SystemFactory extends Factory {
  build(element, values) {
    
    let innerlist = values.map((val) => {return "<li>" + val.name + "</li>";})
    console.log(innerlist);
    element.innerHTML = "<ul>" + innerlist.join("") + "</ul>"

  }
}



function fill_element_from_request_using_factory(element, request, factory) {
  request.then(async (res) => {
    let data = await res.json();
    console.log(data);
    // element.innerHTML = factory.build(data);
    factory.build(element, data);
  });
}


// fill_element_from_request_using_factory(document.getElementById("nav-home"), fetch("http://localhost:8081/version/"), new ListFactory()); // to have the example and see that the whole api is working as we expect

// fill_element_from_request_using_factory(document.getElementById("v-pills-version"), fetch("http://localhost:8081/version/"), new VersionFactory());

fill_element_from_request_using_factory(document.getElementById("v-pills-features"), fetch("http://localhost:8081/feature/"), new FeatureFactory());

// fill_element_from_request_using_factory(document.getElementById("v-pills-systems"), fetch("http://localhost:8081/system/"), new SystemFactory());