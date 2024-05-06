

import { Typography, Box, Container, Paper, Grid } from '@mui/material';

function Home() {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to Reflector
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Streamlined Study Experience
                            </Typography>
                            <Typography>
                                By centralizing all your course-related materials in one place, Reflector enhances your study experience. Spend less time hunting for notes and more time mastering your subjects.
                            </Typography>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                COMING SOON: Collaborative Learning
                            </Typography>
                            <Typography>
                                Get ready for an even richer learning experience with Reflector's upcoming collaboration features. Collaborate with peers, share insights, and tackle group projects seamlessly. (stretch)
                            </Typography>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                COMING SOON: Voice-to-Text Input
                            </Typography>
                            <Typography>
                                Say it, and Reflector will capture it. Our upcoming voice-to-text feature allows you to effortlessly input notes using your voice, making note-taking a breeze. (stretch)
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Efficient Organization
                            </Typography>
                            <Typography>
                                Reflector empowers you to organize notes effortlessly with features like course categorization and topic tagging. No more digging through piles of notes; find what you need instantly.
                            </Typography>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                COMING SOON: Interactive Quizzes
                            </Typography>
                            <Typography>
                                Elevate your study sessions with Reflector's upcoming interactive quizzes. Convert your notes into engaging quizzes tailored to your course content, providing an automated path to mastering your subjects. (stretch)
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Home;