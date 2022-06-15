import "./bootstrap.min.css";
import "./index.css";
import { useState } from "react";
import axios from "axios";

function App() {
  let [result, setResult] = useState([]);
  let [creation, setCreation] = useState({ add: false, update: false });
  const handleClick = (key) => {
    let temp = structuredClone(creation);
    for (let i in temp) {
      temp[i] = i === key ? true : false;
    }
    setCreation(temp);
  }
  return (
    <div className="container mt-4 row">
      <div className="container col-4">
        <ButtonClick click={() => reqGet(setResult)} label="Get emplyees" />
        <ButtonClick click={() => handleClick("add")} label="Add" />
        <ButtonClick click={() => handleClick("update")} label="Update" />
        {
          (creation.add || creation.update) && (
            <InputAdd setCreation={setCreation} type={creation.add ? "add" : "update"} result={result} setResult={setResult} />
          )
        }
      </div>
      <div className="container col-8 tableBody">
        {
          result.length > 0 && (<Table result={result} />)
        }
      </div>
    </div>
  );
}

function ButtonClick({ click, label }) {
  return (
    <button onClick={click} className="btn btn-primary m-2">{label}</button>
  );
}


function InputAdd({ setCreation, setResult, result, type }) {
  let [tempState, setTempState] = useState({ userId: "", title: "", body: "" });
  const handleChange = (value, key, isNum) => {
    value = isNum === "number" ? parseInt(value.target.value) : value.target.value;
    let temp = structuredClone(tempState);
    temp[key] = value;
    setTempState(temp);
  }
  return (
    <div className="bg-dark p-2 rounded-3">
      {
        type === "update" && <Inputs type="number" name="id" handleChange={handleChange} />
      }
      <Inputs type="number" name="userId" handleChange={handleChange} />
      <Inputs type="text" name="title" handleChange={handleChange} />
      <textarea onChange={e => handleChange(e, "body", false)} className="mt-2 form-control" cols="20" rows="2" name="texte" id="texte"></textarea>
      <button onClick={() => {
        reqPost(tempState, setResult, result, type);
        setCreation({ add: false, update: false });
      }} className="btn btn-primary mt-2">{type}</button>
    </div>
  );
}






function reqPost(tempState, setResult, result, type) {
  let promise = axios.post("https://jsonplaceholder.typicode.com/posts", {
    method: type === "add" ? 'POST' : 'PUT',
    body: JSON.stringify(tempState),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  promise.then((response) => {
    let resp = JSON.parse(response.data.body), temp = result.slice();
    if (type === "add") {
      resp["id"] = response.data.id;
      temp.push(resp);
      setResult(temp);
    } else {
      update(tempState.id, setResult, result, tempState);
    }
  }).catch((error) => {
    console.log(error);
  })
}

function update(id, setResult, creation, newValues) {
  let temp = creation.slice();
  temp[id - 1] = newValues;
  setResult(temp);
}

function reqGet(setResult) {
  const promise = axios.get("https://jsonplaceholder.typicode.com/posts");
  promise
    .then((response) => {
      setResult(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function Table({ result }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Id</th>
          <th>UserId</th>
          <th>Title</th>
          <th>Body</th>
        </tr>
      </thead>
      <tbody>
        {result.map((item) => (
          <tr key={`${item.id}-${item.title}`}>
            <td>{item.id}</td>
            <td>{item.userId}</td>
            <td>{item.title}</td>
            <td>{item.body}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Inputs({ type, name, handleChange }) {
  return (
    <input onChange={e => handleChange(e, name, type)} type={type} className="form-control mt-2" placeholder={name} />
  );
}

export default App;
