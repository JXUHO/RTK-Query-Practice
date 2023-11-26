import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementReducer,
  incrementReducer,
} from "./features/counter/counterSlice";
import { useAddTaskMutation, useCompleteTaskMutation, useGetTaskQuery } from "./features/task/taskSlice";
import { v4 as uuidv4 } from "uuid";

function App() {
  const dispatch = useDispatch();
  const countValue = useSelector((state) => state.counter.value);
  const [inputText, setInputText] = useState("");

  const { data, isLoading, isError, error } = useGetTaskQuery("Juho");
  const [addTask] = useAddTaskMutation();
  const [completeTask] = useCompleteTaskMutation()


  const inputHandler = (e) => {
    setInputText(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    addTask({
      task: inputText,
      taskId: uuidv4(),
      userName: "Juho",
      created: new Date().toISOString(),
      complete: false
    });
    setInputText("");
  };

  const completeButtonClickHandler = (taskId) => {
    console.log(taskId);
    completeTask({taskId})
  };

  if (isLoading) {
    return <h1>Loading...</h1>
  }


  return (
    <>
      <form
        onSubmit={submitHandler}
        className="flex h-10 items-center justify-center"
      >
        <input
          type="text"
          className="border border-solid"
          value={inputText}
          onChange={inputHandler}
        />
        <button>add</button>
      </form>
      <ul className="flex flex-col items-center justify-center">
        {data?.map((element) => (
          <li key={element.id} className="flex">
            <span className="pr-3">{element.task}</span>
            <button
              className={`border border-black ${
                element.complete ? "bg-pink-300" : "bg-blue-400"
              }`}
              onClick={() => completeButtonClickHandler(element.id)}
            >
              complete
            </button>
          </li>
        ))}
      </ul>
      <div className="flex h-10 items-center justify-center mt-20">
        <button
          onClick={() => dispatch(incrementReducer())}
          className="px-5 border"
        >
          +
        </button>
        <button
          onClick={() => dispatch(decrementReducer())}
          className="px-5 border"
        >
          -
        </button>
        <span className="px-5">{countValue}</span>
      </div>
    </>
  );
}

export default App;
