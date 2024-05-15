import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


const StyledCard = styled(Card)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
}));


const CourseCard = ({ data }) => {
    const { user } = useAuth();
    return (
        <StyledCard>
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h5" component="div">
                            Course: {data?.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        {user.id === data?.creator_id && (
                            <Tooltip title="Update Course Name">
                                <IconButton component={Link} to={`/courses/${data.id}/edit`}>
                                    <EditIcon color="secondary" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={2} marginTop={2}>
                    {data?.topics && data?.topics.map(topic => (
                        <Grid item key={topic.id}>
                            <Chip
                                label={topic.name}
                                clickable
                                component={Link}
                                to={`/courses/${data?.id}/topics/${topic.id}/notes`}
                            />
                        </Grid>
                    ))}
                    <Grid item>
                        <Tooltip title="Add Topic">
                            <IconButton component={Link} to={`/courses/${data?.id}/topics/enroll`} type={'topics'}>
                                <AddCircleIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Remove Topic from Course">
                            <IconButton component={Link} to={`/courses/${data?.id}/topics/unenroll`} type={'topics'}>
                                <RemoveCircleIcon color="secondary" />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </CardContent>
        </StyledCard>
    );
};
export default CourseCard;