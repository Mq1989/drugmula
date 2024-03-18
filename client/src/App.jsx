import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState(false);
  const [id, setId] = useState();
  const [result, setResult] = useState();

  // useEffect(() => {
  //   async function getStocks(name) {
  //     const response = axios.get("/stockinfo", {
  //       params: { query: name },
  //     });
  //   }
  //   getStocks(result.data.details.manufacturer_name);
  // }, [result]);

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

  async function getDrug(term) {
    const response = await axios.get("/druginfo", {
      params: {
        query: encodeURI(term.split(" ")[0]),
      },
    });
    console.log(response.data);
    setResult(response);
  }

  function connect(e) {
    setInput(e.target.value);
    console.log(e.target.value);
    clearTimeout(id);
    setSearch(false);
    setResults([]);
    if (e.target.value.length > 1) {
      setId(
        setTimeout(async () => {
          const response = await axios.get("/drugautocomplete", {
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
        }, 800)
      );
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center h-fit w-full self-center align-middle p-4">
        <div className="relative flex flex-col items-center w-full h-fit div-center">
          <div className="flex flex-col items-center align-middle h-14 w-full md:w-1/2 rounded-md xl:w-8/12 ">
            <input
              className="w-full h-full px-2 shadow-md focus:ring-indigo-600 border-2 focus:border-indigo-600 border-gray-300 rounded-lg "
              type="search"
              value={input}
              onFocus={checkInput}
              onChange={(e) => connect(e)}
              name="search"
              id="search"
              onBlur={delayBlur}
              autoComplete="off"
            />
          </div>
          <div
            style={{
              visibility: search ? "visible" : "hidden",
            }}
            className="h-fit z-10 top-16 shadow-md w-full md:w-1/2 xl:w-8/12 absolute mx-2 sm:mx-0 flex flex-col self-center rounded-lg bg-white border-gray-500 border-2 ">
            {results.map((item, index) => (
              <div
                data={item.brandName}
                onClick={() => getDrug(item.brandName)}
                key={index}
                className="flex hover:bg-slate-200 hover:cursor-pointer gap-4 flex-wrap p-2 border-b border-gray-200 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  fill="none">
                  <path
                    d="M20.3036 15.308C20.8142 15.0976 21.0576 14.5131 20.8472 14.0024C20.6367 13.4918 20.0522 13.2485 19.5416 13.4589L11.6964 16.692C11.1858 16.9024 10.9424 17.4869 11.1528 17.9976C11.3633 18.5082 11.9478 18.7515 12.4584 18.5411L20.3036 15.308Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26 16C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16ZM24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M35.9107 33.9251C36.449 34.0489 36.9856 33.7129 37.1094 33.1746C37.2331 32.6364 36.8971 32.0997 36.3588 31.976L28.0893 30.0749C27.551 29.9511 27.0144 30.2871 26.8906 30.8254C26.7669 31.3636 27.1029 31.9003 27.6412 32.024L35.9107 33.9251Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M32 42C37.5228 42 42 37.5228 42 32C42 26.4772 37.5228 22 32 22C26.4772 22 22 26.4772 22 32C22 37.5228 26.4772 42 32 42ZM32 40C36.4183 40 40 36.4183 40 32C40 27.5817 36.4183 24 32 24C27.5817 24 24 27.5817 24 32C24 36.4183 27.5817 40 32 40Z"
                    fill="currentColor"
                  />
                </svg>

                {item.brandName}
              </div>
            ))}
          </div>
        </div>
        {result && (
          <>
          <div className="xl:w-8/12 gap-4 w-full items-center flex flex-col">
            <div className=" h-fit w-full mt-8">
              <h1 className=" text-2xl font-semibold text-slate-900">
                {result.data.name}
              </h1>
              <p> <spa className=" font-medium">Generic: </spa>
              {result.data.details.generic_name}
              </p>
            </div>
            <div className=" h-fit w-full ">
              <h1 className=" text-l font-semibold text-slate-900">Company</h1>
              <p className=" text-pretty line-clamp-3 text-neutral-400">
                {result.data.details.manufacturer_name}
              </p>
            </div>
            <div className=" h-fit w-full ">
              <h1 className=" text-l font-semibold text-slate-900">Launch Date</h1>
              <p className=" text-pretty line-clamp-3 text-neutral-400">
                {result.data.launch_date}
              </p>
            </div>
            <div className=" h-fit w-full">
              <h1 className=" text-l font-semibold text-slate-900">
                Description
              </h1>
              <p className=" text-pretty line-clamp-3 text-neutral-400">
                {result.data.description}
              </p>
            </div>
            <div className=" h-fit w-full">
              <h1 className=" text-l font-semibold text-slate-900">
                Indications
              </h1>
              <p className=" text-pretty line-clamp-3 text-neutral-400">
                {result.data.indications}
              </p>
            </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
