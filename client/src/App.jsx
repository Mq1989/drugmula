import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState(false);
  const [id, setId] = useState();

  function checkInput(e) {
    if (e.target.value.length < 1) {
      setSearch(false);
    }
  }

  function delayBlur() {
    setTimeout(() => {
      setSearch(false);
    }, 1000);
  }



  function connect(e) {
    setInput(e.target.value);
    console.log(e.target.value)
    clearTimeout(id);
    setSearch(false);
    setResults([]);
    if (input.length > 1) {
      setId(
        setTimeout(async () => {
          const response = await axios.get("/autocomplete", {
            params: {
              query: encodeURI(e.target.value),
            },
          });
          if (response) {
            console.log(response.data);
            setResults(response.data);
            setSearch(true);
          } else {
            setSearch(false);
          }
        }, 1000)
      );
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-full align-middle p-4">
        <div className=" flex flex-col items-center justify-center align-middle h-14 w-full md:w-1/2 rounded-md xl:w-1/4 ">
          <input
          className="w-full h-full px-2 shadow-md focus:ring-indigo-600 border-2 border-gray-600 rounded-lg "
            type="text"
            value={input}
            onFocus={checkInput}
            onChange={(e) => connect(e)}
            name="search"
            id="search"
            onBlur={delayBlur}
          />
        </div>
      </div>
    </>
  );
}

export default App;
