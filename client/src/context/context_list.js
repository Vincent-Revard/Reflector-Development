import React from 'react';
import UserProfileDetail from '../components/profile/user_profile_detail';
// import CourseCard from './CourseCard';
// import ReferenceCard from './ReferenceCard';
// import NoteDetail from './NoteDetail';
import { useAuth } from './AuthContext';
import { useProviderContext } from './ContextProvider';

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast } = useProviderContext();
  const { user } = useAuth();
  
  console.log(data);

  const renderComponent = () => {
      const page = currentPage.split('/')[0];
      switch (page) {
      case 'profile':
        return <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
      // case 'courses':
      //   return data.map(course => <CourseCard key={course.id} data={course} />);
      // case 'references':
      //   return data.map(reference => <ReferenceCard key={reference.id} data={reference} />);
      // case 'notes':
      //   return data.map(note => <NoteDetail key={note.id} data={note} />);
      default:
        return <h1>You need to log in to view this page!</h1>;
    }
  };

  return (
    <div className="user-profile-container">
      {user && data ? renderComponent() : <h1>You need to log in to view this page!</h1>}
    </div>
  );
};

export default ContextList;