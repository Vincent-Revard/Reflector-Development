// import { useMemo } from 'react';
// import UserProfileDetail from '../components/profile/user_profile_detail';
// // import CourseCard from './CourseCard';
// // import ReferenceCard from './ReferenceCard';
// // import NoteDetail from './NoteDetail';
// import { useAuth } from './AuthContext';
// import { useProviderContext } from './ContextProvider';
// import CourseCard from './course_card';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import TopicCard from './topic_card';
// import { Container, Typography } from '@mui/material';
// import NoteCard from './note_card';
// import NewNote from './newNote';
// import SearchAndAddCourseOrTopic from './search_or_add_course_and_topic';
// import { Link } from 'react-router-dom';
// import { styled } from '@mui/material';
// import Button from '@mui/material/Button';
// import { CircularProgress } from '@mui/material';
// import Stack from '@mui/material/Stack';
// import NoteIndexCard from './note_index_card';
// import CourseNewEdit from './course_new_edit_form';

// const StyledButton = styled(Button)({
//   margin: '10px',
// });

// const ContextList = () => {
//   const { data, handlePatchContext, handleDeleteContext, currentPage, showToast, isLoading } = useProviderContext();
//   const { courseId, topicId, noteId } = useParams();
//   const navigate = useNavigate();
//   const { user , checkingRefresh } = useAuth();
//   console.log(user)


//   const renderComponent = useMemo(() => {
//     console.log('renderComponent function called with data:', data);
//     let baseRoute = currentPage.split('/')[0];

//     if (baseRoute.includes('profile')) {
//       return data?.id && <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
//     }
//     if (courseId && topicId) {
//       if (currentPage.includes('new')) {
//         return <NewNote />;
//       }
//       if (noteId) {
//         if (currentPage.includes('edit')) {
//           return <NewNote />;
//         }
//         if (data?.note?.id === Number(noteId)) {
//           return <NoteCard key={data.note.id} note={data.note} courseId={courseId} topicId={topicId} />;
//         } else {
//           console.log('noteId from route params does not match noteId from data');
//         }
//       }
//     }
//     if (courseId && topicId && !noteId) {
//       return (
//         <>
//           <Link to={`/course/${courseId}/topic/${topicId}/new`}>
//             <StyledButton variant="contained" color="primary">
//               New Note
//             </StyledButton>
//           </Link>
//           {data?.notes?.map(note => (
//             <NoteIndexCard key={note.id} note={note} courseId={courseId} topicId={topicId} />
//           ))}
//         </>
//       );
//     }
//     if (courseId && topicId && !noteId) {
//       if (data?.topic?.id === Number(topicId)) {
//         return <TopicCard key={data.topic.id} data={data.topic} courseId={courseId} />;
//       }
//     }
//     if (courseId && currentPage.includes('edit')) {
//       // Check if the course with the given courseId exists in the data
//       if (data?.course?.id === Number(courseId)) {
//         // Render the NewCourseOrTopic component to edit the course
//         return <CourseNewEdit key={data.course.id} data={data.course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
//       } else {
//         console.log('courseId from route params does not match courseId from data');
//       }
//     }
//     if (currentPage.includes('courses/enroll')) {
//       return <SearchAndAddCourseOrTopic allNames={data.courses} type='courses/enroll' />;
//     }
//     if (courseId && currentPage.includes('topics/enroll')) {
//       return <SearchAndAddCourseOrTopic allNames={data.topics} type={`course/${courseId}/topics/enroll`} />;
//     }
//     if (courseId) {
//       return <CourseCard key={data.id} data={data} courseId={courseId} />;
//     }
//     return (
//       <div>
//         <Link to={`/courses/enroll`}>
//           <StyledButton variant="contained" color="primary">
//             Add courses to your course list
//           </StyledButton>
//         </Link>
//         {data?.courses?.map(course => (
//           course?.id && <CourseCard key={course.id} data={course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />
//         ))}
//       </div>
//     );
//   }, [data, currentPage, handleDeleteContext, handlePatchContext, showToast, user, courseId, topicId, noteId])
  
//   if (isLoading) {
//     return <CircularProgress />; 
//   }

//   return (
//     <Container className="user-profile-container">
//       {user && data && !checkingRefresh ? renderComponent :
//         (!checkingRefresh && user === null) ?
//           (<Typography variant="h5">
//             Oops! Your session has expired. Please login again.
//             <Stack spacing={2} direction="row">
//               <Button variant="contained" onClick={() => navigate('/registration')}>Go to Sign In</Button>
//               <Button variant="contained" onClick={() => navigate('/')}>Return Home</Button>
//             </Stack>
//           </Typography>) :
//           ((!checkingRefresh && user) || (!checkingRefresh && user === null && !data)) ?
//           (<Typography variant="h5">
//             Sorry, you don't have access to this page.
//             <Stack spacing={2} direction="row">
//               <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
//               <Button variant="contained" onClick={() => navigate('/')}>Return Home</Button>
//             </Stack>
//             </Typography>) :
//             null
//       }
//     </Container>
//   );
// };

// export default ContextList;
import { useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useProviderContext } from './ContextProvider';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, CircularProgress, Stack } from '@mui/material';
import { styled } from '@mui/material';
import { Link } from 'react-router-dom';
import UserProfileDetail from '../components/profile/user_profile_detail';
import CourseCard from './course_card';
import TopicCard from './topic_card';
import NoteCard from './note_card';
import NewNote from './newNote';
import SearchAndAddCourseOrTopic from './search_or_add_course_and_topic';
import NoteIndexCard from './note_index_card';
import CourseNewEdit from './course_new_edit_form';

const StyledButton = styled(Button)({
  margin: '10px',
});

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast, isLoading } = useProviderContext();
  const { courseId, topicId, noteId } = useParams();
  const navigate = useNavigate();
  const { user, checkingRefresh } = useAuth();

  const renderComponent = useMemo(() => {
    const baseRoute = currentPage.split('/')[0];

    if (baseRoute.includes('profile')) {
      return data?.id && <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    if (courseId && topicId) {
      if (currentPage.includes('new') || (noteId && currentPage.includes('edit'))) {
        return <NewNote />;
      }

      if (noteId && data?.note?.id === Number(noteId)) {
        return <NoteCard key={data.note.id} note={data.note} courseId={courseId} topicId={topicId} />;
      }
      if (courseId && topicId && !noteId && data && data.topic) {
        return <TopicCard key={data.id} topic={data.topic} courseId={courseId} />;
      }

      if (courseId && topicId && !noteId) {
        return (
          <>
            <Link to={`/course/${courseId}/topic/${topicId}/new`}>
              <StyledButton variant="contained" color="primary">
                New Note
              </StyledButton>
            </Link>
            {data?.notes?.map(note => (
              <NoteIndexCard key={note.id} note={note} courseId={courseId} topicId={topicId} />
            ))}
          </>
        );
      }

      if (!noteId) {
        return (
          <>
            <Link to={`/course/${courseId}/topic/${topicId}/new`}>
              <StyledButton variant="contained" color="primary">
                New Note
              </StyledButton>
            </Link>
            {data?.notes?.map(note => (
              <NoteIndexCard key={note.id} note={note} courseId={courseId} topicId={topicId} />
            ))}
          </>
        );
      }
    }

    if (courseId && currentPage.includes('edit') && data?.course?.id === Number(courseId)) {
      return <CourseNewEdit key={data.course.id} data={data.course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    if (currentPage.includes('courses/enroll')) {
      return <SearchAndAddCourseOrTopic allNames={data.courses} type='courses/enroll' />;
    }

    if (courseId && currentPage.includes('topics/enroll')) {
      return <SearchAndAddCourseOrTopic allNames={data.topics} type={`course/${courseId}/topics/enroll`} />;
    }

    if (courseId) {
      return <CourseCard key={data.id} data={data.course} courseId={courseId} />;
    }

    return (
      <div>
        <Link to={`/courses/enroll`}>
          <StyledButton variant="contained" color="primary">
            Add courses to your course list
          </StyledButton>
        </Link>
        {data?.courses?.map(course => (
          course?.id && <CourseCard key={course.id} data={course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />
        ))}
      </div>
    );
  }, [data, currentPage, handleDeleteContext, handlePatchContext, showToast, user, courseId, topicId, noteId])

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container className="user-profile-container">
      {user && data && !checkingRefresh ? renderComponent :
        (!checkingRefresh && user === null) ?
          (<Typography variant="h5">
            Oops! Your session has expired. Please login again.
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={() => navigate('/registration')}>Go to Sign In</Button>
              <Button variant="contained" onClick={() => navigate('/')}>Return Home</Button>
            </Stack>
          </Typography>) :
          ((!checkingRefresh && user) || (!checkingRefresh && user === null && !data)) ?
            (<Typography variant="h5">
              Sorry, you don't have access to this page.
              <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
                <Button variant="contained" onClick={() => navigate('/')}>Return Home</Button>
              </Stack>
            </Typography>) :
            null
      }
    </Container>
  );
};

export default ContextList;