import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function SearchPage() {
const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState(false);
  const [id, setId] = useState();
  const [result, setResult] = useState();
  const [indication, showIndication] = useState(false);
  const [description, showDescription] = useState(false);

  function showDes() {
    showDescription(!description);
    console.log(description);
  }

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
    setInput(term);
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
              className="w-full font-thin h-full px-2 shadow-md focus:ring-indigo-600 border-2 focus:border-indigo-600 border-gray-300 rounded-lg "
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
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M26 16C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16ZM24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M35.9107 33.9251C36.449 34.0489 36.9856 33.7129 37.1094 33.1746C37.2331 32.6364 36.8971 32.0997 36.3588 31.976L28.0893 30.0749C27.551 29.9511 27.0144 30.2871 26.8906 30.8254C26.7669 31.3636 27.1029 31.9003 27.6412 32.024L35.9107 33.9251Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
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
            <div className="xl:w-8/12 gap-2 w-full items-center flex flex-col">
              <div className=" h-fit w-full mt-8">
                <h1 className=" text-5xl text-left font-medium text-blue-700">
                  {result.data.name}
                </h1>
                <p className=" font-thin text-sm text-slate-500">
                  {result.data.details.route}
                </p>
                <div className=" p-3 mt-4 bg-slate-50 rounded-md h-fit w-full ">
                  <h1 className=" text-l font-medium text-slate-600">
                    Ingredients
                  </h1>
                  <p className=" text-pretty font-thin line-clamp-3 text-neutral-600">
                    {result.data.details.generic_name}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-md h-fit w-full ">
                <h1 className=" text-l font-medium text-slate-600">Company</h1>
                <p className="font-thin text-pretty line-clamp-3 text-neutral-600">
                  {result.data.details.manufacturer_name}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-md h-fit w-full ">
                <h1 className=" text-l font-medium text-slate-600">
                  Launch Date
                </h1>
                <p className="font-thin text-pretty line-clamp-3 text-neutral-600">
                  {result.data.launch_date}
                </p>
              </div>
              <div
                className="p-2 overflow-hidden bg-slate-50 rounded-md h-fit w-full flex flex-col cursor-pointer"
                onClick={() => showDescription(!description)}>
                <h1 className=" text-l text-pretty font-medium text-slate-600">
                  Description
                </h1>
                <p className={`font-thin text-pretty text-neutral-600`}>
                  {description === true
                    ? result.data.description
                    : result.data.description.substring(0, 300)}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="blue"
                  className={`w-4 h-4 self-center mt-2 ${description && 'rotate-180'} ease-in-out`}>
                  <path
                    fillRule="evenodd"
                    d="M11.47 13.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06L12 11.69 5.03 4.72a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M11.47 19.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 1 0-1.06-1.06L12 17.69l-6.97-6.97a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className="p-3 bg-slate-50 rounded-md ease-in-out h-fit w-full flex cursor-pointer flex-col justify-center"
                onClick={() => showIndication(!indication)}>
                <h1 className=" text-l font-medium text-slate-600">
                  Indications
                </h1>
                <p
                  className={`font-thin text-pretty ease-in-out text-neutral-600 ${
                    indication == true ? "" : "line-clamp-2"
                  } `}>
                  {result.data.indications}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="blue"
                  className={`w-4 h-4 self-center mt-2 ${indication && 'rotate-180'} ease-in-out`}>
                  <path
                    fillRule="evenodd"
                    d="M11.47 13.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06L12 11.69 5.03 4.72a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M11.47 19.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 1 0-1.06-1.06L12 17.69l-6.97-6.97a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex gap-3 pt-4 w-full flex-wrap flex-row">
                <h3 className=" text-lg font-semibold text-blue-700 w-full block">
                  Clinical Studies
                </h3>
                {result.data.relatedStudies &&
                  result.data.relatedStudies.map((study, i) => (
                    <div
                      className=" h-fit shadow-md lg:w-1/3 sm:w-1/3 hover:underline flex-auto hover:bg-slate-100 hover:cursor-pointer hover:shadow-sm p-2"
                      key={i}>
                      <h1 className=" text-blue-700 text-l underline-offset-2 font-semibold">
                        Clinical Study Sponsored by{" "}
                        {
                          study.Study.ProtocolSection.SponsorCollaboratorsModule
                            .LeadSponsor.LeadSponsorName
                        }
                      </h1>
                      {/* <div className=" h-fit w-fit text-sm py-1 px-2 rounded-xl bg-emerald-400 my-1">{study.Study.ProtocolSection.StatusModule.CompletionDateStruct.CompletionDateType && study.Study.ProtocolSection.StatusModule.CompletionDateStruct.CompletionDateType}</div> */}

                      <p className="font-thin text-pretty line-clamp-3 text-neutral-600">
                        {
                          study.Study.ProtocolSection.DescriptionModule
                            .BriefSummary
                        }
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
                    }