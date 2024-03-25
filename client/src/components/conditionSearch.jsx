import React, { useState, useEffect } from "react";
import axios from "axios";
export default function ConditionSearch() {
  const [results, setResults] = useState([]);
  const [input, setInput] = useState("");
  const [id, setId] = useState();
  const [showing, setShowing] = useState(false);
  const [conOpt, setConOpt] = useState(false);
  const [company, setCompany] = useState();
  const [studies, setStudies] = useState([]);
  const [filteredStudies, setFilteredStudies] = useState([]);
  const [filterType, setFilterType] = useState();
  const [conditions, setConditions] = useState([]);
  const [filtconditions, setFiltConditions] = useState([]);
  const [conInput, setConInput] = useState('');
  

  function sortThisYearStudy() {
    if (filteredStudies && filterType == "year") {
      setFilteredStudies();
      setFilterType();
      return;
    }
    const sorted = studies.filter((s) => s.CompletionDate[0].includes("2024"));
    console.log(sorted);
    if (sorted.length > 0) {
      setFilteredStudies(sorted);
      setFilterType("year");
    } else return;
  }

  function filterText(text) {
    setConInput(text)
    setFiltConditions([])
    let conResults = [];
    conditions.forEach((con) => {
      let wordList = con.conditionName.split(" ");

      wordList.forEach((wordi) => {
        let searchier = text.toLowerCase();
        let lowerWordi = wordi.toLowerCase();
        if (lowerWordi.includes(searchier)) {
          conResults.push(con);
        }
      });
    });
    setFiltConditions(conResults);
  }

  function sortThisCurrentStudy() {
    if (filteredStudies && filterType == "current") {
      setFilteredStudies();
      setFilterType();
      return;
    }
    const sorted = studies.filter((s) => {
      const studyDate = new Date(s.CompletionDate[0]);
      const todaysDate = new Date();
      return todaysDate < studyDate;
    });
    console.log(sorted);
    if (sorted.length > 0) {
      setFilteredStudies(sorted);
      setFilterType("current");
    } else return;
  }

  function inputAction(term) {
    setInput(term);
    clearTimeout(id);
    console.log(term);

    if (term.length > 1) {
      setResults();
      setId(
        setTimeout(async () => {
          console.log(term);
          const response = await axios.get("/companyNameAutoComplete", {
            params: {
              query: term,
            },
          });
          if (response) {
            console.log(response);
            setResults(response.data);
            setShowing(true);
          }
        }, 800)
      );
    }
  }

  async function getCompanyStudies(term) {
    setFilteredStudies();
    setConInput('')
    console.log(term);
    setShowing(false);
    setCompany(term);
    setInput("");
    const response = await axios.get("/getCompanyStudies", {
      params: {
        query: encodeURIComponent(term.replace(" ", "+")),
      },
    });

    console.log(response);

    if (response.data == "No Results") {
      alert("No current trials data");
      return;
    }
    setConOpt(false)
    console.log(response.data);
    setStudies(response.data);
    let conditionList = response.data.map((stud) => stud.Condition).flat();
    const counts = {};
    conditionList.forEach((element) => {
      if (counts[element]) {
        counts[element] += 1;
      } else {
        counts[element] = 1;
      }
    });
    let wtf = Object.keys(counts).map((key) => ({
      conditionName: key,
      count: counts[key],
    }));

    wtf.sort((a, b) => {
      if (a.conditionName < b.conditionName) {
        return -1;
      }
      if (a.conditionName > b.conditionName) {
        return 1;
      }
      return 0;
    });

    setFiltConditions([])

    setConditions(wtf);
  }

  function blurOut() {
    setTimeout(() => {
      setResults();
      setShowing(false);
    }, 300);
  }

  useEffect(() => {
    document.addEventListener("click", (e) => {
      console.log(e.x);
    });
  });

  return (
    <>
      <div
        id="Nav"
        className="w-full flex flex-col items-start px-3 sm:px-20 md:px-60 bg-slate-900 h-fit">
        <div id="WidthSetter" className="w-full sm:w-full xl:w-1/2 py-3">
          <input
            type="search"
            value={input}
            onBlur={() => blurOut()}
            onChange={(e) => inputAction(e.target.value)}
            className="h-12 font-light px-2 w-full rounded-lg shadow-md"
          />
          <div className="relative bg-transparent flex flex-col items-stretch w-full">
            <div
              id="Results"
              style={{ visibility: showing ? "visible" : "hidden" }}
              className="w-full example z-50 overflow-auto  bg-slate-50 scroll-smooth rounded-md shadow-lg mt-4 absolute scroll-m-0 max-h-96">
              {results &&
                results.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => getCompanyStudies(res.FieldValue)}
                    className="flex gap-2 justify-between content-center align-middle border-y-2 border-y-slate-200 cursor-pointer hover:bg-blue-400 flex-row w-full h-full items-start p-2">
                    <div className=" text-sm font-light">{res.FieldValue}</div>{" "}
                    <div className=" font-extralight self-center text-slate-500 text-sm">
                      {res.NStudiesWithValue}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {company && (
        <div className="flex flex-wrap text-2xl md:text-4xl font-light tracking-tighter w-full py-4 px-4 sm:px-20 md:px-60 flex-col gap-4">
          {company}
          <div className=" tracking-tighter font-medium text-slate-400 text-base">
            {studies.length > 0 && `${studies.length} Studies Found`}
          </div>
          <div className="flex gap-1 text-xl tracking-tighter flex-wrap">
            <div
              onClick={() => sortThisCurrentStudy()}
              className={` mr-3 text-start text-sm h-fit ease-in-out duration-300 hover:text-blue-700 hover:slate-50 py-2 rounded-sm w-fit cursor-pointer ${
                filterType == "current"
                  ? " text-blue-500 bg-white underline underline-offset-8 font-medium"
                  : "text-slate-500 "
              } `}>
              {studies.length > 0 &&
                studies.filter((stud) => {
                  const studyDate = new Date(stud.CompletionDate);
                  const now = new Date();
                  return studyDate > now;
                }).length}{" "}
              Studies In Progress
            </div>
            <div
              onClick={() => sortThisYearStudy()}
              className={`" text-sm h-fit ease-in-out duration-300 hover:text-blue-700 hover:bg-slate-50 py-2 rounded-sm w-fit cursor-pointer ${
                filterType == "year"
                  ? " text-blue-500 bg-white underline underline-offset-8 font-medium"
                  : "text-slate-500 "
              } `}>
              {
                studies.filter((studi) =>
                  studi.CompletionDate[0].includes("2024")
                ).length
              }{" "}
              <span className="text-md">Studies Due in 2024</span>
            </div>
          </div>
          <div className="w-full relative flex h-fit flex-row gap-2 py-1">
            <div
              onClick={() => setConOpt(!conOpt)}
              className={`${
                conOpt
                  ? " border-2 border-slate-300 bg-blue-200 text-blue-700"
                  : "bg-slate-100 text-slate-700 border-2 border-slate-300"
              } h-fit ease-in-out flex duration-300 gap-1 items-center w-fit p-2 text-sm tracking-tight cursor-pointer hover:bg-slate-50 hover:text-blue-600 rounded-xl`}>
              {" "}
              Filter by Condition{" "}
              {conOpt && (
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
              )}
            </div>
            <div
              className={`w-full ${conOpt == true ? "scale-100" : "scale-0"} origin-top-left ease-in-out duration-200 p-3 rounded-md absolute top-0 border-4 shadow-sm border-slate-200  bg-white flex h-fit flex-wrap gap-2 py-4`}>
              <p className=" font-sm text-pretty text-lg w-full tracking-tighter text-slate-400">
                Search Condidtions
              </p>
              <div className="flex w-full h-12 mb-4">
                <div className="flex w-full md:w-1/3 border-2 rounded-lg border-slate-400 items-center px-2 h-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>

                  <input
                    onChange={(e) => filterText(e.target.value)}
                    className="text-base text-balance w-full ml-3"
                    type="search"
                    value={conInput}
                  />
                </div>
              </div>
              <div
                className="absolute top-2 right-2 text-sm tracking-normal cursor-pointer font-light text-blue-500 px-2 py-0.5 h-fit w-fit"
                onClick={() => setConOpt(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              {conditions.length > 0 &&
                filtconditions.length == 0 &&
                conditions.map((con) => {
                  return (
                    <div className="p-2 ease-in-out duration-300 w-fit h-fit border-2 border-blue-300 rounded-xl bg-gray-50 text-xs tracking-tighter text-blue-400 font-light">
                      {con.conditionName} {con.count}
                    </div>
                  );
                })}
              {filtconditions.length > 0 &&
                filtconditions.map((con) => {
                  return (
                    <div className="p-2 w-fit h-fit border-2 border-blue-300 rounded-xl bg-gray-50 text-xs tracking-tighter text-blue-400 font-light">
                      {con.conditionName} {con.count}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full pb-10 px-3 sm:px-20 md:px-60 flex-col gap-4">
        {studies &&
          !filteredStudies &&
          studies.map((res, i) => (
            <div
              key={i}
              className="w-full flex-col hover:shadow-md flex gap-1 ease-in-out duration-300 cursor-pointer hover:bg-slate-100 hover:border-slate-100 p-4 hover:underline border-2 border-slate-50 rounded-md h-fit">
              <div className="font-light text-xl text-slate-600 tracking-tight ">
                {res.BriefTitle}
              </div>
              <div className="flex flex-wrap gap-2 w-full items-start">
                {res.Condition.length > 1 &&
                  res.Condition.map((con, i) => (
                    <div
                      key={i}
                      className="font-light text-xs bg-slate-50 w-fit p-1 rounded px-2 text-slate-600 tracking-tighter ">
                      {con}
                    </div>
                  ))}
                {res.Condition.length == 1 && (
                  <div className="font-light text-sm bg-slate-50 w-fit p-1 rounded px-2 text-slate-600 tracking-tighter ">
                    {res.Condition}
                  </div>
                )}{" "}
              </div>
              <div className="flex flex-wrap gap-3">
                {res.InterventionArmGroupLabel.length > 1 &&
                  res.InterventionArmGroupLabel.map((arm, i) => (
                    <div
                      key={i}
                      className="font-light text-xs bg-blue-50 w-fit p-1 rounded px-2 text-slate-600 tracking-tighter ">
                      {arm}
                    </div>
                  ))}
                {res.InterventionArmGroupLabel.length == 1 && (
                  <div
                    key={i}
                    className="font-light text-xs bg-blue-50 w-fit p-1 rounded px-2 text-slate-600 tracking-tighter ">
                    {res.InterventionArmGroupLabel[0]}
                  </div>
                )}
              </div>
              <div className="flex gap-1 text-green-700 pt-1 tracking-tight text-xs text-pretty font-light">
                <span className=" font-extralight tracking-tighter text-pretty text-slate-400">
                  Estimated Completetion:
                </span>
                <p className=" font-normal">{res.CompletionDate}</p>
              </div>
              {res.Phase.length > 1 &&
                res.Phase.map((pha, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor:
                        res.Phase[0] === "Phase 1"
                          ? "black"
                          : res.Phase[0] === "Phase 2"
                          ? "orange"
                          : res.Phase[0] === "Phase 3"
                          ? "blue"
                          : res.Phase[0] === "Early Phase 1"
                          ? "black"
                          : res.Phase[0] === "Not Applicaple"
                          ? "grey"
                          : res.Phase[0] === "Phase 4"
                          ? "red"
                          : "green",
                    }}
                    className="font-xs font-light text-white hover:no-underline text-xs tracking-tighter px-2 py-1 mt-2 rounded-md w-fit ">
                    {pha}
                  </div>
                ))}
              {res.Phase.length == 1 && (
                <div
                  style={{
                    backgroundColor:
                      res.Phase[0] === "Phase 1"
                        ? "black"
                        : res.Phase[0] === "Early Phase 1"
                        ? "black"
                        : res.Phase[0] === "Phase 2"
                        ? "orange"
                        : res.Phase[0] === "Phase 3"
                        ? "blue"
                        : res.Phase[0] === "Not Applicaple"
                        ? "grey"
                        : res.Phase[0] === "Phase 4"
                        ? "red"
                        : "green",
                  }}
                  className="font-xs font-light text-white hover:no-underline text-xs tracking-tighter px-2 py-1 mt-2 rounded-md w-fit ">
                  {res.Phase}
                </div>
              )}
            </div>
          ))}
        {filteredStudies &&
          filteredStudies.map((res, i) => (
            <div
              key={i}
              className="w-full flex-col hover:shadow-md flex gap-1 ease-in-out duration-300 cursor-pointer hover:bg-slate-100 hover:border-slate-400 p-4 hover:underline border border-slate-100 rounded-md h-fit">
              <div className="font-light text-xl text-slate-600 tracking-tight ">
                {res.BriefTitle}
              </div>
              <div className="flex flex-wrap gap-2 w-full items-start">
                {res.Condition.length > 1 &&
                  res.Condition.map((con, i) => (
                    <div
                      key={i}
                      className="font-light text-xs bg-slate-50 w-fit p-1 rounded px-2 text-slate-600 tracking-tighter ">
                      {con}
                    </div>
                  ))}
                {res.Condition.length == 1 && (
                  <div className="font-light text-xs bg-slate-50 w-fit p-1 rounded px-2 text-slate-600 tracking-tighter ">
                    {res.Condition}
                  </div>
                )}{" "}
              </div>
              <div className="flex flex-wrap gap-3">
                {res.InterventionArmGroupLabel.length > 1 &&
                  res.InterventionArmGroupLabel.map((arm, i) => (
                    <div
                      key={i}
                      className="font-light text-xs bg-blue-50 w-fit p-1 rounded px-2 text-slate-600 tracking-tighter ">
                      {arm}
                    </div>
                  ))}
                {res.InterventionArmGroupLabel.length == 1 && (
                  <div
                    key={i}
                    className="font-light text-xs bg-blue-50 w-fit p-1 rounded px-2 text-slate-600 tracking-tighter ">
                    {res.InterventionArmGroupLabel[0]}
                  </div>
                )}
              </div>
              <div className="flex gap-1 text-green-700 pt-1 tracking-tight text-xs text-pretty font-light">
                <span className=" font-extralight tracking-tighter text-pretty text-slate-400">
                  Estimated Completetion:
                </span>
                <p className=" font-normal">{res.CompletionDate}</p>
              </div>
              {res.Phase.length > 1 &&
                res.Phase.map((pha, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor:
                        res.Phase[0] === "Phase 1"
                          ? "black"
                          : res.Phase[0] === "Phase 2"
                          ? "orange"
                          : res.Phase[0] === "Phase 3"
                          ? "blue"
                          : res.Phase[0] === "Early Phase 1"
                          ? "black"
                          : res.Phase[0] === "Not Applicaple"
                          ? "grey"
                          : res.Phase[0] === "Phase 4"
                          ? "red"
                          : "green",
                    }}
                    className="font-xs font-light text-white hover:no-underline text-xs tracking-tighter px-2 py-1 mt-2 rounded-md w-fit ">
                    {pha}
                  </div>
                ))}
              {res.Phase.length == 1 && (
                <div
                  style={{
                    backgroundColor:
                      res.Phase[0] === "Phase 1"
                        ? "black"
                        : res.Phase[0] === "Early Phase 1"
                        ? "black"
                        : res.Phase[0] === "Phase 2"
                        ? "orange"
                        : res.Phase[0] === "Phase 3"
                        ? "blue"
                        : res.Phase[0] === "Not Applicaple"
                        ? "grey"
                        : res.Phase[0] === "Phase 4"
                        ? "red"
                        : "green",
                  }}
                  className="font-xs font-light text-white hover:no-underline text-xs tracking-tighter px-2 py-1 mt-2 rounded-md w-fit ">
                  {res.Phase}
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
