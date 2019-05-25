import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const ColoredCheckbox = withStyles({
  root: {
    color: props => props.color,
    '&$checked': {
      color: props => props.color,
    },
  },
  checked: {},
})(props => <Checkbox color="default" {...props} />);

const Legend = ({ fields, onChange }) => (
  <form>
    <Typography variant="h5" gutterBottom>
      Legenda
    </Typography>
    <FormGroup>
      {Object.entries(fields).map(([key, field]) => (
        <FormControlLabel
          key={key}
          control={
            <ColoredCheckbox
              checked={field.visible}
              onChange={event => onChange(key, event.target.checked)}
              value={key}
              color={field.color}
            />
          }
          label={field.label}
        />
      ))}
    </FormGroup>
  </form>
);

export default Legend;
