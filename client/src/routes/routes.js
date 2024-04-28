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
import VerifiyPage from '../components/pages/VerifyPage';
import UserProfileDetail from '../components/profile/user_profile_detail';
import Error from '../components/errors/Error';
import NotFound from '../components/errors/NotFound';
import ProfileProvider from '../context/ProfileProvider';
import UserProfileList from '../components/profile/user_profile_list';

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
        element: <CourseList />,
        children: [
          {
            // path: ":courseId",
            // element: <CourseDetail />,
            // children: [
            //   {
            //     path: "topics",
            //     element: <TopicList />,
            //     children: [
            //       {
            //         path: ":topicId",
            //         element: <TopicDetail />,
            //         children: [
            //           {
            //             path: "notes",
            //             element: <NoteList />,
            //             children: [
            //               {
            //                 path: ":noteId",
            //                 element: <NoteDetail />
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
          <ProfileProvider >
            <UserProfileList >
              <UserProfileDetail />
            </UserProfileList >
          </ProfileProvider>
        )
      },
      {
        path: "notes",
        element: <NoteList />,
        children: [
          {
            path: ":noteId",
            element: <NoteDetail />
          }
        ]
      },
      {
        path: "registration",
        element: <Registration />
      },
      {
        path: "verify/:token",
        element: <VerifiyPage />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

export default router;