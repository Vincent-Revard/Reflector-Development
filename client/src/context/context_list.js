import { useMemo } from 'react';
import UserProfileDetail from '../components/profile/user_profile_detail';
// import CourseCard from './CourseCard';
// import ReferenceCard from './ReferenceCard';
// import NoteDetail from './NoteDetail';
import { useAuth } from './AuthContext';
import { useProviderContext } from './ContextProvider';
import CourseCard from './course_card';
import { useLocation, useParams } from 'react-router-dom';
import TopicCard from './topic_card';
import { Container, Typography } from '@mui/material';
import NoteCard from './note_card';
import NewNote from './newNote';

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast } = useProviderContext();
  const { user } = useAuth();
  const { courseId, topicId, noteId } = useParams();

  const renderComponent = useMemo(() => {
    console.log('renderComponent function called with data:', data);
    let baseRoute = currentPage.split('/')[0];

    if (baseRoute.includes('profile')) {
      return data?.id && <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    if (baseRoute !== 'courses') {
      return <h1>You need to log in to view this page!</h1>;
    }
    if (courseId && topicId && noteId) {
      if (currentPage.includes('edit')) {
        return <NewNote />;
      }
      if (data?.note?.id === Number(noteId)) {
        return <NoteCard key={data.note.id} note={data.note} courseId={courseId} topicId={topicId} />;
      } else {
        console.log('noteId from route params does not match noteId from data');
      }
    }
    if (courseId && topicId) {
      // Render the topic with the given topicId in the course with the given courseId
      return null;
    }
    if (courseId) {
      // Render the course with the given courseId
      return null;
    }
    return data?.courses?.map(course => (
      course?.id && <CourseCard key={course.id} data={course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />
    ));
  }, [data, currentPage, handleDeleteContext, handlePatchContext, showToast, user, courseId, topicId, noteId])

  return (
    <Container className="user-profile-container">
      {user && data ? renderComponent : <Typography variant="h1">You need to log in to view this page!</Typography>}
    </Container>
  );
};

export default ContextList;