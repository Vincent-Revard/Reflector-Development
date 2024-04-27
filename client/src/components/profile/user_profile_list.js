import React from 'react';
import UserProfileDetail from './user_profile_detail'
import { useAuth } from '../context/AuthContext';
import { useProfileContext } from '../../context/ProfileProvider';
// import '../styles/UserProfile.scss';

const UserProfileList = () => {
  const { profileData, handlePatchProfile, handleDeleteProfile, currentPage } = useProfileContext();
  const { user } = useAuth();
  
  console.log(profileData);
    
    if (!currentPage) {
      return null;
    }
  
    return (
      <div className="user-profile-container">
        
        {user && profileData ? (
          
            <>
            <div>
              {profileData.map((userProfile) => (
                  <UserProfileDetail
                    key={userProfile.id}
                    profileData={userProfile}
                    handlePatchProfile={handlePatchProfile}
                    handleDeleteProfile={handleDeleteProfile}
                  />
                )
              )}
              </div>
            </>
          ) : (
            <h1>You need to log in to view this page! </h1>
          )}

      </div>
    );
  };
  
  export default UserProfileList;