import React from 'react';
import UserProfileDetail from '../components/profile/user_profile_detail';
// import CourseCard from './CourseCard';
// import ReferenceCard from './ReferenceCard';
// import NoteDetail from './NoteDetail';
import { useAuth } from './AuthContext';
import { useProviderContext } from './ContextProvider';
import ContextCard from './context_card';
import { useLocation } from 'react-router-dom';
import TopicCard from './topic_card';
import { Container, Typography } from '@mui/material';
import NoteCard from './note_card';

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast } = useProviderContext();
  const { user } = useAuth();
  const location = useLocation();

  const renderComponent = () => {

    let baseRoute = currentPage.split('/')[0];
    let id = currentPage.split('/')[1];
    if (baseRoute.includes('profile')) {
      return <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    } else {
      switch (baseRoute) {
      case 'courses':
        return data.courses?.map(course => (
        <ContextCard key={course.id} data={course} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast}>
          {course.topics?.map(topic => (
            // Ensure that 'topic' is distinct from 'note'
            <TopicCard key={topic.id} data={topic} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext}>
              {topic.notes?.map(note => (
                // Adjust how NoteCard displays its 'data' prop if necessary
                <NoteCard key={note.id} data={note} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext}/>
              ))}
            </TopicCard>
          ))}
        </ContextCard>
      ));
        default:
          return <h1>You need to log in to view this page!</h1>;
      }
    };
  }
  return (
    <Container className="user-profile-container">
      {user && data ? renderComponent() : <Typography variant="h1">You need to log in to view this page!</Typography>}
    </Container>
  );
};


export default ContextList;