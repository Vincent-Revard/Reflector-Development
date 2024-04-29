import React from 'react';
import UserProfileDetail from '../components/profile/user_profile_detail';
// import CourseCard from './CourseCard';
// import ReferenceCard from './ReferenceCard';
// import NoteDetail from './NoteDetail';
import { useAuth } from './AuthContext';
import { useProviderContext } from './ContextProvider';
import ContextCard from './context_card';
import { useLocation } from 'react-router-dom';

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast } = useProviderContext();
  const { user } = useAuth();
  const location = useLocation();
  
  console.log(data);

  const renderComponent = () => {

    let baseRoute = currentPage.split('/')[0];
    let id = currentPage.split('/')[1];
    // let page = location.pathname.split('/')[1];
    // if (page === 'profile/:id') {
    //   page = location.pathname.slice(1);
    // }
    // switch (page) {
    // case 'profile':
    //   return <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext}   
    // handleDeleteContext = { handleDeleteContext } showToast = { showToast } />;
    // case 'courses':
    //     return data.map(course => <ContextCard key={course.id} data={course} />);


    // let pathParts = location.pathname.split('/');
    // let baseRoute = pathParts[1];
    // let id = pathParts[2];

    if (baseRoute.includes('profile')) {
      return <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    } else {
      switch (baseRoute) {
        case 'courses':
          return data.map(course => <ContextCard key={course.id} data={course} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />);
        // case 'topics':
        //     return data.map(topic => <TopicCard key={topic.id} data={topic} />);
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
    <div className="user-profile-container">
      {user && data ? renderComponent() : <h1>You need to log in to view this page!</h1>}
    </div>
  );
  };


export default ContextList;