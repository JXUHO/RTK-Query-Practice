import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestoreApi } from "../../app/fireStoreApi";
import { db } from "../../firebase";

export const taskApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    getTask: build.query({
      async queryFn(userName) {
        console.log("getTask triggered");
        try {
          const querySnapshot = await getDocs(
            collection(db, `users/${userName}/tasks`)
          );
          let taskArr = [];
          querySnapshot.forEach((doc) => {
            taskArr.push(doc.data());
          });
          return { data: taskArr };
        } catch (error) {
          console.log(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["Task"],
    }),

    addTask: build.mutation({
      async queryFn({ task, taskId, userName, created, complete }) {
        console.log("addTask triggered");
        try {
          const docRef = setDoc(doc(db, `users/${userName}/tasks`, taskId), {
            id: taskId,
            task,
            created,
            complete,
          });
          return { data: docRef.id };
        } catch (error) {
          console.log(error);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Task"],
    }),

    completeTask: build.mutation({
      async queryFn({ taskId }) {
        console.log("completeTask triggered");
        try {
          //users - Juho - tasks - taskId - complete
          const docRef = doc(db, `users/${"Juho"}/tasks/${taskId}`);
          const docSnapShot = await getDoc(docRef);
          let currentCompleteValue;
          if (docSnapShot.exists()) {
            currentCompleteValue = docSnapShot.data().complete;
          }
          await updateDoc(docRef, {
            complete: !currentCompleteValue,
          });

          return { data: "return value from completeTask queryFn" };
        } catch (error) {
          return { error: error.message };
        }
      },

      async onQueryStarted({ taskId }, { dispatch, queryFulfilled }) {
        console.log("onQueryStarted");
        
        try {
          const patchResult = dispatch(
            firestoreApi.util.updateQueryData("getTask", "Juho", (draft) => {
              // console.log("callback!!!!!!!!!!!!!!!!!!!!!");
              // console.log(JSON.stringify(draft))
              // console.log(taskId)
              // console.log(JSON.stringify(draft.find(item => item.id === taskId)))
              const targetToChange = draft.find(item => item.id === taskId)
              targetToChange.complete = !targetToChange.complete
            })
          );

          await queryFulfilled;
          console.log("success");

        } catch (error) {
          console.log("error");
          patchResult.undo();
        }
      },

      invalidatesTags: ["Task"],
    }),
  }),
});

export const { useGetTaskQuery, useAddTaskMutation, useCompleteTaskMutation } =
  taskApi;
