import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles( theme => ({
    error : {
      backgroundColor: theme.palette.error.dark,
      margin: theme.spacing(1),
    },
    success: {
      backgroundColor: theme.palette.success.dark,
      margin: theme.spacing(1),
    },
    icon : {
      fontSize: 20,
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    }
  }));