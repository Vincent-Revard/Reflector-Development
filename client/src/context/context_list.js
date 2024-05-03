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


const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast } = useProviderContext();
  const { user } = useAuth();
  const { courseId, topicId, noteId } = useParams();


  const renderComponent = useMemo(() => {

    let baseRoute = currentPage.split('/')[0];
    if (baseRoute.includes('profile')) {
      return data && data.id ? <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} /> : null;
    } else {
      switch (baseRoute) {
        case 'courses':
          if (courseId && !topicId) {
            // Render the course with the given courseId
          } else if (courseId && topicId && !noteId) {
            // Render the topic with the given topicId in the course with the given courseId
          } else if (courseId && topicId && noteId) {
            // Render the note with the given noteId in the topic with the given topicId in the course with the given courseId
          } else {
            return data && data.courses ? data.courses?.map(course => (
              course && course.id ? <CourseCard key={course.id} data={course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast}>
                {course.topics?.map(topic => (
                  topic && topic.id ? <TopicCard key={topic.id} topic={topic} user={user} courseId={course.id} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext}>
                    {topic.notes?.map(note => (
                      note && note.id ? <NoteCard key={note.id} data={note} courseId={course.id} topicId={topic.id} /> : null
                    ))}
                  </TopicCard> : null
                ))}
              </CourseCard> : null
            )) : null;
          }
          break;
        default:
          return <h1>You need to log in to view this page!</h1>;
      }
    };
  }, [data, currentPage, handleDeleteContext, handlePatchContext, showToast, user, courseId, topicId, noteId])

  return (
    <Container className="user-profile-container">
      {user && data ? renderComponent : <Typography variant="h1">You need to log in to view this page!</Typography>}
    </Container>
  );
};

export default ContextList;