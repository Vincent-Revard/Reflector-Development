import { Container, Typography, Box, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#333', color: '#fff', p: 2, mt: 2, textAlign: 'center' }}>
      <Container maxWidth="lg">
        <Typography>
          &#x26A1; This site was built with &#128150; by
          <Link href='https://github.com/Vincent-Revard' color="inherit" underline="hover" target='_blank' rel='noopener noreferrer'>
            👨‍🎤 Vincent Revard
          </Link>
          &nbsp; for educational purposes. &#x26A1;
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;