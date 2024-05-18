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
import TopicNewEdit from './topic_new_edit_form';

const StyledButton = styled(Button)({
  margin: '10px',
});

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast, isLoading } = useProviderContext();
  debugger
  const { courseId, topicId, noteId } = useParams();
  const navigate = useNavigate();
  const { user, checkingRefresh } = useAuth();

  const renderComponent = useMemo(() => {
    const baseRoute = currentPage.split('/')[0];
    if (!data) {
      return null;  // or some loading state
    }
    
    // Check for profile first
    if (baseRoute.includes('profile')) {
      return data?.id && <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    // Check for new note
    if (courseId && topicId && (currentPage.includes('note/new') || (noteId && currentPage.includes('note/edit')))) {
      return <NewNote />;
    }

    // Check for topic edit
    if (courseId && currentPage.includes('topics/edit') && data?.topic?.id === Number(topicId)) {
      return <TopicNewEdit key={data.topic.id} data={data.topic} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    // Check for new topic
    if (currentPage.includes('topics/new')) {
      return <TopicNewEdit key='new' user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    // Check for course edit
    if (courseId && currentPage.includes('courses/edit') && data?.course?.id === Number(courseId)) {
      return <CourseNewEdit key={data.course.id} data={data.course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    // Check for new course
    if (currentPage.includes('courses/new')) {
      return <CourseNewEdit key='new' user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    // if (baseRoute.includes('profile')) {
    //   return data?.id && <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    // }
    // if (currentPage.includes('topics/new')) {
    //   return <TopicNewEdit key='new' user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    // }
    // if (courseId && currentPage.includes('topics/edit') && data?.topic?.id === Number(topicId)) {
    //   return <TopicNewEdit key={data.topic.id} data={data.topic} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    // }
    // if (currentPage.includes('new')) {
    //   return <CourseNewEdit key='new' user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    // }
    // if (courseId && currentPage.includes('edit') && data?.course?.id === Number(courseId)) {
    //   return <CourseNewEdit key={data.course.id} data={data.course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    // }

      if (noteId && data?.note?.id === Number(noteId)) {
        return <NoteCard key={data.note.id} note={data.note} courseId={courseId} topicId={topicId} />;
      }
      if (courseId && topicId && !noteId && data && data.topic) {
        return <TopicCard key={data.id} topic={data.topic} courseId={courseId} />;
      }

      if (courseId && topicId && !noteId && data?.notes?.length > 0) {
        return (
          <>
            {/* <Typography variant="h6">Topic: {data?.notes[0].topic.name}</Typography> */}
              <Link to={`/course/${courseId}/topic/${topicId}/note/new`}>
                <StyledButton variant="contained" color="primary">
                  New Note
                </StyledButton>
              </Link>
              <Link to="/course">
                <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>Go Back to Courses</Button>
              </Link>
            {data.notes.map(note => (
              <NoteIndexCard key={note.id} note={note} courseId={courseId} topicId={topicId} />
            ))}
          </>
        );
      }
      if (courseId && (currentPage.includes('topics/enroll') || currentPage.includes('topics/unenroll'))) {
        return <SearchAndAddCourseOrTopic allNames={data.not_associated_topics} associatedTopics={data.associated_topics} courseId={ courseId } type={'topics'} />;
      }
      if (!noteId) {
        return (
          <>
            {/* <Typography variant="h6">Topic: {data?.notes[0].topic.name}</Typography> */}
            <Link to={`/course/${courseId}/topic/${topicId}/note/new`}>
              <StyledButton variant="contained" color="primary">
                New Note
              </StyledButton>
            </Link>
            <Link to="/course">
              <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>Go Back to Courses</Button>
            </Link>
            {data?.notes?.map(note => (
              <NoteIndexCard key={note.id} note={note} courseId={courseId} topicId={topicId} />
            ))}
          </>
        );
      }

    if (courseId && currentPage.includes('edit') && data?.course?.id === Number(courseId)) {
      return <CourseNewEdit key={data.course.id} data={data.course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    if (currentPage.includes('courses/enroll') || currentPage.includes('courses/unenroll')) {
      return <SearchAndAddCourseOrTopic allNames={data.not_enrolled_courses} enrolledCourses={data.enrolled_courses} type='courses' />;
    }


    if (courseId) {
      return <CourseCard key={data.id} data={data.course} courseId={courseId} />;
    }

    return (
      <div>
        <Link to={`/course/enroll`}>
          <StyledButton variant="contained" color="primary">
            Add courses to your course list
          </StyledButton>
        </Link>
        <Link to={`/course/unenroll`}>
          <StyledButton variant="contained" color="primary">
            Remove courses from your course list
          </StyledButton>
        </Link>
        {data?.courses?.map(course => (
          course?.id && <CourseCard key={course.id} data={course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />
        ))}
      </div>
    );
  }, [data, currentPage, handleDeleteContext, handlePatchContext, showToast, user, courseId, topicId, noteId, ])

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