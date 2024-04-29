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

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast } = useProviderContext();
  const { user } = useAuth();
  const location = useLocation();
  
  console.log(data);

  const renderComponent = () => {

    let baseRoute = currentPage.split('/')[0];
    let id = currentPage.split('/')[1];
    if (baseRoute.includes('profile')) {
      return <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    } else {
      switch (baseRoute) {
        case 'courses':
          return data.map(course => <ContextCard key={course.id} data={course} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />);
          case 'topics':
            return data.map(topic => <TopicCard key={topic.id} data={topic} />);
        // case 'references':
        //   return data.map(reference => <ReferenceCard key={reference.id} data={reference} />);
        // case 'notes':
        //   return data.map(note => <NoteCard key={note.id} data={note} />);
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