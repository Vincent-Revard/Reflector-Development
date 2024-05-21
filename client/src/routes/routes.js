// AppRoutes.js
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../components/pages/home';
import Registration from '../components/auth/Registration';
import VerifyPage from '../components/pages/VerifyPage';
import UserProfileDetail from '../components/profile/user_profile_detail';
import Error from '../components/errors/Error';
import NotFound from '../components/errors/NotFound';
import ContextProvider from '../context/ContextProvider';
import ContextList from '../context/context_list';
import NewNote from '../context/newNote';
import NoteCard from '../context/note_card';
import EnrollUnenrollCourseOrTopic from '../context/enroll_unenroll_course_or_topic';
import CourseNewEdit from '../context/course_new_edit_form';
import TopicNewEdit from '../context/topic_new_edit_form';

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
        path: "course",
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
                <CourseNewEdit />
              </ContextProvider>
            )
          },
          {
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
                    <CourseNewEdit />
                  </ContextProvider>
                )
              },
              {
                path: "enroll",
                element: <EnrollUnenrollCourseOrTopic />
              },
              {
                path: "unenroll",
                element: <EnrollUnenrollCourseOrTopic />
              },
              {
                path: "topic",
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
                        <TopicNewEdit />
                      </ContextProvider>
                    )
                  },
                  {
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
                            <TopicNewEdit />
                          </ContextProvider>
                        )
                      },
                      {
                        path: "enroll",
                        element: <EnrollUnenrollCourseOrTopic />
                      },
                      {
                        path: "unenroll",
                        element: <EnrollUnenrollCourseOrTopic />
                      },
                      {
                        path: "note",
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
                                <NewNote />
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
                                    <NewNote />
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
          },
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
      {
        path: "registration",
        element: <Registration />
      },
      {
        path: "verifying/:token",
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