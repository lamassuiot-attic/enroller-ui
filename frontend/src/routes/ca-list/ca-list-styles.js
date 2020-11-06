import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles( theme => ({
    list: {
      width: '100%',
      height: '100%',
      borderRadius: 3,
      backgroundColor: theme.palette.background.paper,
      border: '1px solid rgba(0, 0, 0, 0.12)',
    },
    card: {
        padding: '0px'
    }
  }));