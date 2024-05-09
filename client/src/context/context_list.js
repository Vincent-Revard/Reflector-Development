import { useMemo } from 'react';
import UserProfileDetail from '../components/profile/user_profile_detail';
// import CourseCard from './CourseCard';
// import ReferenceCard from './ReferenceCard';
// import NoteDetail from './NoteDetail';
import { useAuth } from './AuthContext';
import { useProviderContext } from './ContextProvider';
import CourseCard from './course_card';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import TopicCard from './topic_card';
import { Container, Typography } from '@mui/material';
import NoteCard from './note_card';
import NewNote from './newNote';
import SearchAndAddCourseOrTopic from './search_or_add_course_and_topic';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';
import Button from '@mui/material/Button';
const StyledButton = styled(Button)({
  margin: '10px',
});

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast } = useProviderContext();
  const { courseId, topicId, noteId } = useParams();
  const navigate = useNavigate();
  const user = useAuth().user;
  console.log(user)


  const renderComponent = useMemo(() => {
    console.log('renderComponent function called with data:', data);
    let baseRoute = currentPage.split('/')[0];

    if (baseRoute.includes('profile')) {
      return data?.id && <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }
    if (courseId && topicId) {
      if (currentPage.includes('new')) {
        return <NewNote />;
      }
      if (noteId) {
        if (currentPage.includes('edit')) {
          return <NewNote />;
        }
        if (data?.note?.id === Number(noteId)) {
          return <NoteCard key={data.note.id} note={data.note} courseId={courseId} topicId={topicId} />;
        } else {
          console.log('noteId from route params does not match noteId from data');
        }
      }
    }
    if (courseId && topicId) {
      // Render the topic with the given topicId in the course with the given courseId
      return null;
    }
    if (currentPage.includes('courses/enroll')) {
      return <SearchAndAddCourseOrTopic allNames={data.courses} type='courses/enroll' />;
    }
    if (courseId && currentPage.includes('topics/enroll')) {
      return <SearchAndAddCourseOrTopic allNames={data.topics} type={`course/${courseId}/topics/enroll`} />;
    }
    if (courseId) {
      // Render the course with the given courseId
      return null;
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

  return (
    <Container className="user-profile-container">
      {user && data ? renderComponent :
        user === null ?
          (<Typography variant="h1">
            Your session has expired. You need to login again. You are being redirected to the sign in page.
            {setTimeout(() => navigate('/registration'), 3000)}
          </Typography>) :
          (<Typography variant="h1">
            You are attemping to view a page you do not have access to. You are being redirected back a page.
            {setTimeout(() => navigate(-1), 3000)}
          </Typography>)
      }
    </Container>
  );
};

export default ContextList;