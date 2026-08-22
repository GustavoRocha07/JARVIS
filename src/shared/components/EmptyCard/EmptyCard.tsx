import { Box, Card, CardContent, Typography } from "@mui/material";

import SignalWifiBadIcon from '@mui/icons-material/SignalWifiBad';
export const EmptyCard = () => {
    return (
        <Card sx={{
            marginTop: '2rem'
        }}>
            <CardContent>
                <Box sx={{
                  
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <SignalWifiBadIcon sx={{
                        fontSize: '12rem'
                    }} />
                    <Typography variant="body2" sx={{
                        fontSize: '1.5rem'
                    }}>
                        Não existe Tarefas!
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}