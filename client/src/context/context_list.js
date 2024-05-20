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
import TopicIndexCard from './topic_index_card';

const StyledButton = styled(Button)({
  margin: '10px',
});

const ContextList = () => {
  const { data, handlePatchContext, handleDeleteContext, currentPage, showToast, isLoading } = useProviderContext();
  const { courseId, topicId, noteId } = useParams();
  const navigate = useNavigate();
  const { user, checkingRefresh } = useAuth();
  console.log(currentPage)

  const renderComponent = useMemo(() => {
    const baseRoute = currentPage.split('/')[0];
    if (!data) {
      return null;  // or some loading state
    }

    if (baseRoute.includes('profile')) {
      return data?.id && <UserProfileDetail key={data.id} data={data} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }
    if (courseId && !noteId && currentPage.includes('topics/new')) {
      return <TopicNewEdit key='new' user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }
    if (courseId && currentPage.includes('topics/edit') && data?.topic?.id === Number(topicId)) {
      return <TopicNewEdit key={data.topic.id} data={data.topic} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }
    if (!courseId && !topicId && !noteId && currentPage.includes('new')) {
      return <CourseNewEdit key='new' user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }
    if (!topicId && !noteId && courseId && currentPage.includes('edit') && data?.course?.id === Number(courseId)) {
      return <CourseNewEdit key={data.course.id} data={data.course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }
    if ((courseId && topicId && !noteId && data.topics) || (courseId && !topicId && !noteId && data && data.topics)) {
      return (
        <>
          <Typography variant="h6">Course: {data?.topics[0].course_name}</Typography>
          {data.topics.map(topic => <TopicIndexCard key={topic.id} topic={topic} courseId={courseId} />)}
        </>
      )
    }

    if (courseId && topicId) {
      if (currentPage.includes('new') || (courseId && topicId && noteId && currentPage.includes('edit'))) {
        return <NewNote />;
      }
      if (noteId && data?.note?.id === Number(noteId)) {
        return <NoteCard key={data.note.id} note={data.note} courseId={courseId} topicId={topicId} />;
      }
      if (courseId && topicId && !noteId && !currentPage.includes('topics/enroll') && !currentPage.includes('topics/unenroll')) {
        return (
          <>
            <Typography variant="h6">
              {data?.notes && data?.notes.length > 0 ? `Topic: ${data?.notes[0]?.topic?.name}` : 'Add a note to this topic!'}
            </Typography>
            <Link to={`/course/${courseId}/topic/${topicId}/note/new`}>
              <StyledButton variant="contained" color="primary">
                New Note
              </StyledButton>
            </Link>
            <Link to="/course">
              <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>Go All Courses</Button>
            </Link>
            <Link to={`/course/${courseId}`}>
              <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
                Go All Topics for {data?.notes && data?.notes.length > 0 ? `${data?.notes[0]?.topic?.course_topics[0]?.course}` : 'this course'}
              </Button>
            </Link>
            {data?.notes?.length > 0 ? (
              data?.notes?.map(note => (
                <NoteIndexCard key={note.id} note={note} courseId={courseId} topicId={topicId} />
              ))
            ) : (
              <Typography variant="body1">You don't have any notes created yet for this topic under this course!</Typography>
            )}
          </>
        );
      }
    }
    // if (currentPage.includes('topics/enroll') || currentPage.includes('topics/unenroll')) {
    //   return <SearchAndAddCourseOrTopic allNames={data?.not_associated_topics} associatedTopics={data?.associated_topics} courseId={courseId}
    //     courseName={data?.course_information?.course_name} type={'topics'} />;
    // }
    if (currentPage.includes('topics/enroll') || currentPage.includes('topics/unenroll')) {
      return (
        <SearchAndAddCourseOrTopic
          allNames={data?.not_associated_topics}
          associatedTopics={data?.associated_topics}
          courseId={courseId}
          courseName={data?.course_information?.course_name}
          type={'topics'}
        />
      );
    }

    if (!noteId && !topicId && courseId && currentPage.includes('courses/edit') && data?.course?.id === Number(courseId)) {
      return <CourseNewEdit key={data.course.id} data={data.course} user={user} handlePatchContext={handlePatchContext} handleDeleteContext={handleDeleteContext} showToast={showToast} />;
    }

    if (currentPage.includes('courses/enroll') || currentPage.includes('courses/unenroll')) {
      return <SearchAndAddCourseOrTopic allNames={data.not_enrolled_courses} enrolledCourses={data.enrolled_courses} type='courses' />;
    }

    if (courseId && !topicId && !noteId) {
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
  }, [data, currentPage, handleDeleteContext, handlePatchContext, showToast, user, courseId, topicId, noteId,])

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
