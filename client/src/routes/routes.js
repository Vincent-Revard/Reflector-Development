// AppRoutes.js
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../components/pages/home';
// import CourseList from '../components/CourseList'; 
// import CourseDetail from '../components/CourseDetail'; 
// import TopicList from '../components/TopicList';
// import TopicDetail from '../components/TopicDetail';
// import NoteList from '../components/NoteList'; 
// import NoteDetail from '../components/NoteDetail'; 
// import QuizDetail from '../components/QuizDetail'; 
// import ProfileDetail from '../components/ProfileDetail';
// import ProfileDetailForm from '../components/ProfileDetailForm'; 
// import CourseForm from '../components/CourseForm'; 
// import TopicForm from '../components/TopicForm'; 
// import NoteForm from '../components/NoteForm'; 
import Registration from '../components/auth/Registration';
// import NotFound from '../components/NotFound'; 
// import ErrorPage from '../components/ErrorPage'; 
import VerifyPage from '../components/pages/VerifyPage';
import UserProfileDetail from '../components/profile/user_profile_detail';
import Error from '../components/errors/Error';
import NotFound from '../components/errors/NotFound';
import ContextProvider from '../context/ContextProvider';
import ContextList from '../context/context_list';
import NewNote from '../context/newNote';
import EditableCard from '../context/editable_card';
import NewCourse from '../context/newCourse';
import NewTopic from '../context/newTopic';
import NoteCard from '../context/note_card';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />
      },
      {
        path: "courses",
        element: (
          <ContextProvider>
            <ContextList />
          </ContextProvider>
        ),
        children: [
          {
            path: "new",
            element: (
              <ContextProvider>
                <NewCourse />
              </ContextProvider>
            ),
            path: ":courseId",
            element: (
              <ContextProvider>
                <ContextList />
              </ContextProvider>
            ),
            children: [
              {
                path: "edit",
                element: (
                  <ContextProvider>
                    <EditableCard />
                  </ContextProvider>
                )
              },
              {
                path: "topics",
                element: (
                  <ContextProvider>
                    <ContextList />
                  </ContextProvider>
                ),
                children: [
                  {
                    path: "new",
                    element: (
                      <ContextProvider>
                        <NewTopic />
                      </ContextProvider>
                    ),
                    path: ":topicId",
                    element: (
                      <ContextProvider>
                        <ContextList />
                      </ContextProvider>
                    ),
                    children: [
                      {
                        path: "edit",
                        element: (
                          <ContextProvider>
                            <EditableCard />
                          </ContextProvider>
                        )
                      },
                      {
                        path: "notes",
                        element: (
                          <ContextProvider>
                            <ContextList />
                          </ContextProvider>
                        ),
                        children: [
                          {
                            path: "new",
                            element: (
                              <ContextProvider>
                                <ContextList >
                                  <NewNote />
                                </ContextList >
                              </ContextProvider>
                            )
                          },
                          {
                            path: ":noteId",
                            element: (
                              <ContextProvider>
                                <ContextList >
                                  <NoteCard />
                                </ContextList >
                              </ContextProvider>
                            ),
                            children: [
                              {
                                path: "edit",
                                element: (
                                  <ContextProvider>
                                    <EditableCard />
                                  </ContextProvider>
                                )
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: "profile/:id",
        element: (
          <ContextProvider >
            <ContextList >
              <UserProfileDetail />
            </ContextList >
          </ContextProvider>
        )
      },
      // {
      //   path: "notes",
      //   element: <NoteList />,
      //   children: [
      //     {
      //       path: ":noteId",
      //       element: <NoteDetail />
      //     }
      //   ]
      // },
      {
        path: "registration",
        element: <Registration />
      },
      {
        path: "verify/:token",
        element: <VerifyPage />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);


export default router;